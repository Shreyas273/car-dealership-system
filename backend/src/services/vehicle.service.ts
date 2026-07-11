import { AppError } from '../middleware/error.middleware';
import { IVehicleDocument } from '../models/vehicle.model';
import { vehicleRepository } from '../repositories/vehicle.repository';
import {
  UpdateVehicleInput,
  VehicleInput,
  VehicleResponse,
  VehicleSearchQuery,
} from '../types/vehicle.types';

export class VehicleService {
  async createVehicle(input: VehicleInput): Promise<VehicleResponse> {
    this.validateVehicleInput(input);

    const vehicle = await vehicleRepository.create({
      make: input.make.trim(),
      model: input.model.trim(),
      category: input.category.trim(),
      price: input.price,
      quantity: input.quantity,
      image: input.image?.trim(),
      description: input.description?.trim(),
    });

    return mapVehicleToResponse(vehicle);
  }

  async getAllVehicles(): Promise<VehicleResponse[]> {
    const vehicles = await vehicleRepository.findAll();
    return vehicles.map((vehicle) => mapVehicleToResponse(vehicle));
  }

  async getVehicleById(id: string): Promise<VehicleResponse> {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new AppError(404, 'Vehicle not found');
    }

    return mapVehicleToResponse(vehicle);
  }

  async updateVehicle(
    id: string,
    input: UpdateVehicleInput,
  ): Promise<VehicleResponse> {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new AppError(404, 'Vehicle not found');
    }

    if (input.price !== undefined && input.price < 0) {
      throw new AppError(400, 'Price cannot be negative');
    }

    if (input.quantity !== undefined && input.quantity < 0) {
      throw new AppError(400, 'Quantity cannot be negative');
    }

    const updated = await vehicleRepository.update(id, input);
    if (!updated) {
      throw new AppError(404, 'Vehicle not found');
    }

    return mapVehicleToResponse(updated);
  }

  async deleteVehicle(id: string): Promise<void> {
    const vehicle = await vehicleRepository.delete(id);
    if (!vehicle) {
      throw new AppError(404, 'Vehicle not found');
    }
  }

  async searchVehicles(query: VehicleSearchQuery): Promise<VehicleResponse[]> {
    const vehicles = await vehicleRepository.search({
      make: query.make,
      model: query.model,
      category: query.category,
      minPrice: query.minPrice !== undefined ? Number(query.minPrice) : undefined,
      maxPrice: query.maxPrice !== undefined ? Number(query.maxPrice) : undefined,
    });

    return vehicles.map((vehicle) => mapVehicleToResponse(vehicle));
  }

  private validateVehicleInput(input: VehicleInput): void {
    if (
      !input.make?.trim() ||
      !input.model?.trim() ||
      !input.category?.trim() ||
      input.price === undefined ||
      input.quantity === undefined
    ) {
      throw new AppError(
        400,
        'Make, model, category, price, and quantity are required',
      );
    }

    if (input.price < 0) {
      throw new AppError(400, 'Price cannot be negative');
    }

    if (input.quantity < 0) {
      throw new AppError(400, 'Quantity cannot be negative');
    }
  }
}

export const vehicleService = new VehicleService();

export const mapVehicleToResponse = (
  vehicle: IVehicleDocument,
): VehicleResponse => ({
  id: vehicle._id.toString(),
  make: vehicle.make,
  model: vehicle.model,
  category: vehicle.category,
  price: vehicle.price,
  quantity: vehicle.quantity,
  image: vehicle.image,
  description: vehicle.description,
  createdAt: vehicle.createdAt,
  updatedAt: vehicle.updatedAt,
});
