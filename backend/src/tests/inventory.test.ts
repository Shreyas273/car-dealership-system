import request from 'supertest';
import app from '../app';
import { Vehicle } from '../models/vehicle.model';
import { authHeader, createTestUser } from './helpers/auth.helper';

const validVehicle = {
  make: 'Toyota',
  model: 'Camry',
  category: 'Sedan',
  price: 25000,
  quantity: 2,
  image: 'https://example.com/camry.jpg',
  description: 'Reliable mid-size sedan',
};

describe('Inventory APIs', () => {
  let adminToken: string;
  let userToken: string;
  let vehicleId: string;

  beforeEach(async () => {
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const admin = await createTestUser({
      email: `admin-${suffix}@example.com`,
      role: 'admin',
    });
    const user = await createTestUser({
      email: `user-${suffix}@example.com`,
      role: 'user',
    });
    adminToken = admin.token;
    userToken = user.token;

    const vehicle = await Vehicle.create(validVehicle);
    vehicleId = vehicle._id.toString();
  });

  describe('POST /api/vehicles/:id/purchase', () => {
    it('should decrease quantity when a user purchases', async () => {
      const response = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set(authHeader(userToken))
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.vehicle.quantity).toBe(1);

      const updated = await Vehicle.findById(vehicleId);
      expect(updated?.quantity).toBe(1);
    });

    it('should reject purchase when quantity is zero', async () => {
      await Vehicle.findByIdAndUpdate(vehicleId, { quantity: 0 });

      const response = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set(authHeader(userToken))
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/out of stock/i);
    });

    it('should reject unauthenticated purchase', async () => {
      await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .expect(401);
    });

    it('should return 404 for non-existent vehicle', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      await request(app)
        .post(`/api/vehicles/${fakeId}/purchase`)
        .set(authHeader(userToken))
        .expect(404);
    });
  });

  describe('POST /api/vehicles/:id/restock', () => {
    it('should allow admin to increase quantity', async () => {
      const response = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set(authHeader(adminToken))
        .send({ amount: 5 })
        .expect(200);

      expect(response.body.data.vehicle.quantity).toBe(7);

      const updated = await Vehicle.findById(vehicleId);
      expect(updated?.quantity).toBe(7);
    });

    it('should reject non-admin restock', async () => {
      await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set(authHeader(userToken))
        .send({ amount: 5 })
        .expect(403);
    });

    it('should reject invalid restock amount', async () => {
      const response = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set(authHeader(adminToken))
        .send({ amount: 0 })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should default restock amount to 1', async () => {
      const response = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set(authHeader(adminToken))
        .send({})
        .expect(200);

      expect(response.body.data.vehicle.quantity).toBe(3);
    });
  });
});
