import { Router } from "express";
import {
  getAllInventoryItems,
  getInventoryItemById,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryCategories,
  getInventoryStats,
  createPurchaseEntry,
  getPurchaseEntries
} from "../controllers/inventory";

const router = Router();

router.get("/", getAllInventoryItems);
router.get("/categories", getInventoryCategories);
router.get("/stats", getInventoryStats);
router.get("/:id", getInventoryItemById);

router.post("/", createInventoryItem);
router.put("/:id", updateInventoryItem);
router.delete("/:id", deleteInventoryItem);

// Purchases
router.post("/purchases", createPurchaseEntry);
router.get("/purchases", getPurchaseEntries);

export { router as inventoryRoutes };
