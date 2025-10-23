import { Router } from "express";
import {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  searchMenuItems,
  getMenuCategories,
  getMenuInsights
} from "../controllers/menu";

const router = Router();

router.get("/", getAllMenuItems);
router.get("/search", searchMenuItems);
router.get("/categories", getMenuCategories);
router.get("/insights", getMenuInsights);
router.get("/:id", getMenuItemById);
router.post("/", createMenuItem);
router.put("/:id", updateMenuItem);
router.delete("/:id", deleteMenuItem);

export { router as menuRoutes };
