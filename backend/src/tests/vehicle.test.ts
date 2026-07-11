import request from 'supertest';
import app from '../app';
import { Vehicle } from '../models/vehicle.model';
import { authHeader, createTestUser } from './helpers/auth.helper';

const validVehicle = {
  make: 'Toyota',
  model: 'Camry',
  category: 'Sedan',
  price: 25000,
  quantity: 5,
  image: 'https://example.com/camry.jpg',
  description: 'Reliable mid-size sedan',
};

describe('Vehicle CRUD APIs', () => {
  let adminToken: string;
  let userToken: string;

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
  });

  describe('POST /api/vehicles', () => {
    it('should allow admin to create a vehicle', async () => {
      const response = await request(app)
        .post('/api/vehicles')
        .set(authHeader(adminToken))
        .send(validVehicle)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.vehicle).toMatchObject({
        make: validVehicle.make,
        model: validVehicle.model,
        category: validVehicle.category,
        price: validVehicle.price,
        quantity: validVehicle.quantity,
      });
      expect(response.body.data.vehicle.id).toBeDefined();
    });

    it('should reject non-admin users', async () => {
      const response = await request(app)
        .post('/api/vehicles')
        .set(authHeader(userToken))
        .send(validVehicle)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should reject unauthenticated requests', async () => {
      await request(app).post('/api/vehicles').send(validVehicle).expect(401);
    });

    it('should reject missing required fields', async () => {
      const response = await request(app)
        .post('/api/vehicles')
        .set(authHeader(adminToken))
        .send({ make: 'Toyota' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/vehicles', () => {
    beforeEach(async () => {
      await Vehicle.create(validVehicle);
      await Vehicle.create({
        ...validVehicle,
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: 22000,
      });
    });

    it('should return all vehicles for authenticated users', async () => {
      const response = await request(app)
        .get('/api/vehicles')
        .set(authHeader(userToken))
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.vehicles).toHaveLength(2);
    });

    it('should reject unauthenticated requests', async () => {
      await request(app).get('/api/vehicles').expect(401);
    });
  });

  describe('GET /api/vehicles/:id', () => {
    let vehicleId: string;

    beforeEach(async () => {
      const vehicle = await Vehicle.create(validVehicle);
      vehicleId = vehicle._id.toString();
    });

    it('should return a vehicle by id', async () => {
      const response = await request(app)
        .get(`/api/vehicles/${vehicleId}`)
        .set(authHeader(userToken))
        .expect(200);

      expect(response.body.data.vehicle.make).toBe(validVehicle.make);
    });

    it('should return 404 for non-existent vehicle', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/vehicles/${fakeId}`)
        .set(authHeader(userToken))
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/vehicles/:id', () => {
    let vehicleId: string;

    beforeEach(async () => {
      const vehicle = await Vehicle.create(validVehicle);
      vehicleId = vehicle._id.toString();
    });

    it('should allow admin to update a vehicle', async () => {
      const response = await request(app)
        .put(`/api/vehicles/${vehicleId}`)
        .set(authHeader(adminToken))
        .send({ price: 24000, quantity: 10 })
        .expect(200);

      expect(response.body.data.vehicle.price).toBe(24000);
      expect(response.body.data.vehicle.quantity).toBe(10);
    });

    it('should reject non-admin users', async () => {
      await request(app)
        .put(`/api/vehicles/${vehicleId}`)
        .set(authHeader(userToken))
        .send({ price: 24000 })
        .expect(403);
    });
  });

  describe('DELETE /api/vehicles/:id', () => {
    let vehicleId: string;

    beforeEach(async () => {
      const vehicle = await Vehicle.create(validVehicle);
      vehicleId = vehicle._id.toString();
    });

    it('should allow admin to delete a vehicle', async () => {
      await request(app)
        .delete(`/api/vehicles/${vehicleId}`)
        .set(authHeader(adminToken))
        .expect(200);

      const deleted = await Vehicle.findById(vehicleId);
      expect(deleted).toBeNull();
    });

    it('should reject non-admin users', async () => {
      await request(app)
        .delete(`/api/vehicles/${vehicleId}`)
        .set(authHeader(userToken))
        .expect(403);
    });
  });

  describe('GET /api/vehicles/search', () => {
    beforeEach(async () => {
      await Vehicle.create(validVehicle);
      await Vehicle.create({
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: 22000,
        quantity: 3,
        image: 'https://example.com/civic.jpg',
        description: 'Compact sedan',
      });
      await Vehicle.create({
        make: 'Ford',
        model: 'F-150',
        category: 'Truck',
        price: 45000,
        quantity: 2,
        image: 'https://example.com/f150.jpg',
        description: 'Full-size truck',
      });
    });

    it('should search by make', async () => {
      const response = await request(app)
        .get('/api/vehicles/search')
        .query({ make: 'Toyota' })
        .set(authHeader(userToken))
        .expect(200);

      expect(response.body.data.vehicles).toHaveLength(1);
      expect(response.body.data.vehicles[0].make).toBe('Toyota');
    });

    it('should search by model', async () => {
      const response = await request(app)
        .get('/api/vehicles/search')
        .query({ model: 'Civic' })
        .set(authHeader(userToken))
        .expect(200);

      expect(response.body.data.vehicles).toHaveLength(1);
      expect(response.body.data.vehicles[0].model).toBe('Civic');
    });

    it('should search by category', async () => {
      const response = await request(app)
        .get('/api/vehicles/search')
        .query({ category: 'Truck' })
        .set(authHeader(userToken))
        .expect(200);

      expect(response.body.data.vehicles).toHaveLength(1);
      expect(response.body.data.vehicles[0].category).toBe('Truck');
    });

    it('should search by price range', async () => {
      const response = await request(app)
        .get('/api/vehicles/search')
        .query({ minPrice: 20000, maxPrice: 30000 })
        .set(authHeader(userToken))
        .expect(200);

      expect(response.body.data.vehicles).toHaveLength(2);
    });

    it('should return empty array when no matches found', async () => {
      const response = await request(app)
        .get('/api/vehicles/search')
        .query({ make: 'BMW' })
        .set(authHeader(userToken))
        .expect(200);

      expect(response.body.data.vehicles).toHaveLength(0);
    });
  });
});
