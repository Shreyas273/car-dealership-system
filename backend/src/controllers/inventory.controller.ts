import { Request, Response } from 'express';
import { inventoryService } from '../services/inventory.service';
import { getRouteParam } from '../utils/params.util';

export const purchaseVehicle = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const vehicle = await inventoryService.purchaseVehicle(
    getRouteParam(req.params.id),
  );

  res.status(200).json({
    success: true,
    data: { vehicle },
  });
};

export const restockVehicle = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const vehicle = await inventoryService.restockVehicle(
    getRouteParam(req.params.id),
    req.body.amount,
  );

  res.status(200).json({
    success: true,
    data: { vehicle },
  });
};
