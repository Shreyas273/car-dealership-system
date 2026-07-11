export interface Vehicle {
  id: string;
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleFormData {
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
}

export interface VehicleSearchParams {
  make?: string;
  model?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
