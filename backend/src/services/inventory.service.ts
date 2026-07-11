import { AppError } from '../middleware/error.middleware';
import { vehicleRepository } from '../repositories/vehicle.repository';
import { VehicleResponse } from '../types/vehicle.types';
import { mapVehicleToResponse } from './vehicle.service';

export class InventoryService {
  async purchaseVehicle(id: string): Promise<VehicleResponse> {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new AppError(404, 'Vehicle not found');
    }

    if (vehicle.quantity <= 0) {
      throw new AppError(400, 'Vehicle is out of stock');
    }

    const updated = await vehicleRepository.decrementQuantity(id);
    if (!updated) {
      throw new AppError(400, 'Vehicle is out of stock');
    }

    return mapVehicleToResponse(updated);
  }

  async restockVehicle(id: string, amount?: number): Promise<VehicleResponse> {
    const restockAmount = amount ?? 1;

    if (!Number.isInteger(restockAmount) || restockAmount < 1) {
      throw new AppError(400, 'Restock amount must be a positive integer');
    }

    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new AppError(404, 'Vehicle not found');
    }

    const updated = await vehicleRepository.incrementQuantity(id, restockAmount);
    if (!updated) {
      throw new AppError(404, 'Vehicle not found');
    }

    return mapVehicleToResponse(updated);
  }
}

export const inventoryService = new InventoryService();
