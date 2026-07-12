import { IVehicleDocument, Vehicle } from '../models/vehicle.model';
import {
  UpdateVehicleInput,
  VehicleInput,
  ParsedVehicleSearchQuery,
} from '../types/vehicle.types';

type VehicleFilter = Record<string, unknown>;

export class VehicleRepository {
  async create(data: VehicleInput): Promise<IVehicleDocument> {
    return Vehicle.create(data);
  }

  async findAll(): Promise<IVehicleDocument[]> {
    return Vehicle.find().sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IVehicleDocument | null> {
    return Vehicle.findById(id);
  }

  async update(
    id: string,
    data: UpdateVehicleInput,
  ): Promise<IVehicleDocument | null> {
    return Vehicle.findByIdAndUpdate(id, data, {
      returnDocument: 'after',
      runValidators: true,
    });
  }

  async delete(id: string): Promise<IVehicleDocument | null> {
    return Vehicle.findByIdAndDelete(id);
  }

  async search(query: ParsedVehicleSearchQuery): Promise<IVehicleDocument[]> {
    const filter: VehicleFilter = {};

    if (query.make) {
      filter.make = { $regex: query.make, $options: 'i' };
    }

    if (query.model) {
      filter.model = { $regex: query.model, $options: 'i' };
    }

    if (query.category) {
      filter.category = { $regex: query.category, $options: 'i' };
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      const priceFilter: { $gte?: number; $lte?: number } = {};
      if (query.minPrice !== undefined) {
        priceFilter.$gte = query.minPrice;
      }
      if (query.maxPrice !== undefined) {
        priceFilter.$lte = query.maxPrice;
      }
      filter.price = priceFilter;
    }

    return Vehicle.find(filter).sort({ createdAt: -1 });
  }

  async decrementQuantity(
    id: string,
  ): Promise<IVehicleDocument | null> {
    return Vehicle.findOneAndUpdate(
      { _id: id, quantity: { $gt: 0 } },
      { $inc: { quantity: -1 } },
      { returnDocument: 'after' },
    );
  }

  async incrementQuantity(
    id: string,
    amount: number,
  ): Promise<IVehicleDocument | null> {
    return Vehicle.findByIdAndUpdate(
      id,
      { $inc: { quantity: amount } },
      { returnDocument: 'after', runValidators: true },
    );
  }
}

export const vehicleRepository = new VehicleRepository();
