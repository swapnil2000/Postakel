import { Router } from "express";
import { getAllCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer } from "../controllers/customer";
const router = Router();

router.get("/", getAllCustomers);
router.get("/:id", getCustomerById);
router.post("/", createCustomer);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

export { router as customerRoutes };
