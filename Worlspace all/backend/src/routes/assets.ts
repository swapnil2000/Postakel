import { Router } from 'express';
import { AssetController } from '../controllers/AssetController';
import { authMiddleware } from '../middleware';

const router = Router();

router.post('/', authMiddleware, AssetController.createAsset);
router.get('/', authMiddleware, AssetController.getAssets);
router.post('/:assetId/assign', authMiddleware, AssetController.assignAsset);
router.post('/:assignmentId/return', authMiddleware, AssetController.returnAsset);

export default router;
