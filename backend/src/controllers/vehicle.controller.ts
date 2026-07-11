import { Request, Response } from 'express';
import { vehicleService } from '../services/vehicle.service';
import { getRouteParam } from '../utils/params.util';

export const createVehicle = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const vehicle = await vehicleService.createVehicle(req.body);

  res.status(201).json({
    success: true,
    data: { vehicle },
  });
};

export const getAllVehicles = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const vehicles = await vehicleService.getAllVehicles();

  res.status(200).json({
    success: true,
    data: { vehicles },
  });
};

export const getVehicleById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const vehicle = await vehicleService.getVehicleById(getRouteParam(req.params.id));

  res.status(200).json({
    success: true,
    data: { vehicle },
  });
};

export const updateVehicle = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const vehicle = await vehicleService.updateVehicle(
    getRouteParam(req.params.id),
    req.body,
  );

  res.status(200).json({
    success: true,
    data: { vehicle },
  });
};

export const deleteVehicle = async (
  req: Request,
  res: Response,
): Promise<void> => {
  await vehicleService.deleteVehicle(getRouteParam(req.params.id));

  res.status(200).json({
    success: true,
    message: 'Vehicle deleted successfully',
  });
};

export const searchVehicles = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const vehicles = await vehicleService.searchVehicles(req.query);

  res.status(200).json({
    success: true,
    data: { vehicles },
  });
};
