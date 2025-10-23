import { Router } from "express";
import {
  getAllInventoryItems,
  getInventoryItemById,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  searchInventory,
  getInventoryCategories,
  getInventoryStats
} from "../controllers/inventory";

const router = Router();

router.get("/", getAllInventoryItems);
router.get("/search", searchInventory);
router.get("/categories", getInventoryCategories);
router.get("/stats", getInventoryStats);
router.get("/:id", getInventoryItemById);
router.post("/", createInventoryItem);
router.put("/:id", updateInventoryItem);
router.delete("/:id", deleteInventoryItem);

export { router as inventoryRoutes };
