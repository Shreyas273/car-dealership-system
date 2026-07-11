import { api } from './axios';
import type {
  ApiResponse,
  Vehicle,
  VehicleFormData,
  VehicleSearchParams,
} from '../types/vehicle';

export const vehicleApi = {
  getAll: async (): Promise<Vehicle[]> => {
    const { data } = await api.get<ApiResponse<{ vehicles: Vehicle[] }>>(
      '/api/vehicles',
    );
    return data.data.vehicles;
  },

  getById: async (id: string): Promise<Vehicle> => {
    const { data } = await api.get<ApiResponse<{ vehicle: Vehicle }>>(
      `/api/vehicles/${id}`,
    );
    return data.data.vehicle;
  },

  search: async (params: VehicleSearchParams): Promise<Vehicle[]> => {
    const { data } = await api.get<ApiResponse<{ vehicles: Vehicle[] }>>(
      '/api/vehicles/search',
      { params },
    );
    return data.data.vehicles;
  },

  create: async (vehicle: VehicleFormData): Promise<Vehicle> => {
    const { data } = await api.post<ApiResponse<{ vehicle: Vehicle }>>(
      '/api/vehicles',
      vehicle,
    );
    return data.data.vehicle;
  },

  update: async (id: string, vehicle: Partial<VehicleFormData>): Promise<Vehicle> => {
    const { data } = await api.put<ApiResponse<{ vehicle: Vehicle }>>(
      `/api/vehicles/${id}`,
      vehicle,
    );
    return data.data.vehicle;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/vehicles/${id}`);
  },

  purchase: async (id: string): Promise<Vehicle> => {
    const { data } = await api.post<ApiResponse<{ vehicle: Vehicle }>>(
      `/api/vehicles/${id}/purchase`,
    );
    return data.data.vehicle;
  },

  restock: async (id: string, amount = 1): Promise<Vehicle> => {
    const { data } = await api.post<ApiResponse<{ vehicle: Vehicle }>>(
      `/api/vehicles/${id}/restock`,
      { amount },
    );
    return data.data.vehicle;
  },
};
