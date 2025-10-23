import { Router } from "express";
import {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  searchStaff,
  getStaffRoles,
  getStaffStats
} from "../controllers/staff";

const router = Router();

router.get("/", getAllStaff);
router.get("/search", searchStaff);
router.get("/roles", getStaffRoles);
router.get("/stats", getStaffStats);
router.get("/:id", getStaffById);
router.post("/", createStaff);
router.put("/:id", updateStaff);
router.delete("/:id", deleteStaff);

export { router as staffRoutes };
