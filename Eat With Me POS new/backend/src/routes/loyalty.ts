import { Router } from "express";
import {
  getAllLoyaltyLogs,
  getCustomerLoyaltyLog,
  addLoyaltyLog
} from "../controllers/loyalty";

const router = Router();

router.get("/", getAllLoyaltyLogs);
router.get("/:id", getCustomerLoyaltyLog);
router.post("/:id", addLoyaltyLog);

export { router as loyaltyRoutes };
