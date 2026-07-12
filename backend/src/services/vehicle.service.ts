import { AppError } from '../middleware/error.middleware';
import { IVehicleDocument } from '../models/vehicle.model';
import { vehicleRepository } from '../repositories/vehicle.repository';
import {
  UpdateVehicleInput,
  VehicleInput,
  VehicleResponse,
  VehicleSearchQuery,
} from '../types/vehicle.types';

const TEXT_PATTERN = /^[A-Za-z\s'-]+$/;

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

    if (input.price !== undefined) {
      this.validateNumericField(input.price, 'Price');
    }

    if (input.quantity !== undefined) {
      this.validateNumericField(input.quantity, 'Quantity');
    }

    if (input.make !== undefined) {
      this.validateTextField(input.make, 'Make');
    }

    if (input.model !== undefined) {
      this.validateTextField(input.model, 'Model');
    }

    if (input.category !== undefined) {
      this.validateTextField(input.category, 'Category');
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
    const minPrice =
      query.minPrice !== undefined && query.minPrice !== ''
        ? Number(query.minPrice)
        : undefined;
    const maxPrice =
      query.maxPrice !== undefined && query.maxPrice !== ''
        ? Number(query.maxPrice)
        : undefined;

    this.validateSearchPrices(minPrice, maxPrice);

    const vehicles = await vehicleRepository.search({
      make: query.make,
      model: query.model,
      category: query.category,
      minPrice,
      maxPrice,
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

    this.validateNumericField(input.price, 'Price');
    this.validateNumericField(input.quantity, 'Quantity');

    this.validateTextField(input.make, 'Make');
    this.validateTextField(input.model, 'Model');
    this.validateTextField(input.category, 'Category');
  }

  private validateTextField(value: string, fieldName: string): void {
    if (!TEXT_PATTERN.test(value.trim())) {
      throw new AppError(400, `${fieldName} must contain letters only`);
    }
  }

  private validateNumericField(value: number, fieldName: string): void {
    if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
      throw new AppError(400, `${fieldName} must contain numbers only`);
    }

    if (value < 0) {
      throw new AppError(400, `${fieldName} cannot be negative`);
    }

    if (!Number.isInteger(value)) {
      throw new AppError(400, `${fieldName} must be a whole number`);
    }
  }

  private validateSearchPrices(minPrice?: number, maxPrice?: number): void {
    if (minPrice !== undefined) {
      this.validateNumericField(minPrice, 'Min price');
    }

    if (maxPrice !== undefined) {
      this.validateNumericField(maxPrice, 'Max price');
    }

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      throw new AppError(400, 'Min price must be less than or equal to max price');
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
