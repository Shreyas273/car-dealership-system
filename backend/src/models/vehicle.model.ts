import mongoose, { Document, Schema } from 'mongoose';

export interface IVehicleDocument extends Omit<Document, 'model'> {
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

const vehicleSchema = new Schema<IVehicleDocument>(
  {
    make: {
      type: String,
      required: [true, 'Make is required'],
      trim: true,
      match: [/^[A-Za-z\s'-]+$/, 'Make must contain letters only'],
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
      match: [/^[A-Za-z\s'-]+$/, 'Model must contain letters only'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      match: [/^[A-Za-z\s'-]+$/, 'Category must contain letters only'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Price must contain numbers only',
      },
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: 'Quantity must contain numbers only',
      },
    },
    image: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

export const Vehicle = mongoose.model<IVehicleDocument>(
  'Vehicle',
  vehicleSchema,
);
