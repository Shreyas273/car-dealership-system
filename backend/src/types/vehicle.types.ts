export interface VehicleInput {
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
}

export interface VehicleResponse {
  id: string;
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VehicleSearchQuery {
  make?: string;
  model?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface UpdateVehicleInput {
  make?: string;
  model?: string;
  category?: string;
  price?: number;
  quantity?: number;
  image?: string;
  description?: string;
}
