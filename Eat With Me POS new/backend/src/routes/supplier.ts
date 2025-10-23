import { Router } from "express";
import {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  searchSuppliers
} from "../controllers/supplier";

const router = Router();

router.get("/", getAllSuppliers);
router.get("/search", searchSuppliers);
router.get("/:id", getSupplierById);
router.post("/", createSupplier);
router.put("/:id", updateSupplier);
router.delete("/:id", deleteSupplier);

export { router as supplierRoutes };
