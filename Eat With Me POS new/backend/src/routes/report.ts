import { Router } from "express";
import { getFullReport } from "../controllers/report";
const router = Router();

router.get("/", getFullReport);

export { router as reportRoutes };
