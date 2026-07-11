import { Router } from 'express';
import { purchaseVehicle, restockVehicle } from '../controllers/inventory.controller';
import {
  createVehicle,
  deleteVehicle,
  getAllVehicles,
  getVehicleById,
  searchVehicles,
  updateVehicle,
} from '../controllers/vehicle.controller';
import { adminMiddleware, authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/search', authMiddleware, searchVehicles);
router.get('/', authMiddleware, getAllVehicles);
router.get('/:id', authMiddleware, getVehicleById);

router.post('/', authMiddleware, adminMiddleware, createVehicle);
router.put('/:id', authMiddleware, adminMiddleware, updateVehicle);
router.delete('/:id', authMiddleware, adminMiddleware, deleteVehicle);

router.post('/:id/purchase', authMiddleware, purchaseVehicle);
router.post('/:id/restock', authMiddleware, adminMiddleware, restockVehicle);

export default router;
