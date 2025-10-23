import { Router } from "express";
import { getAllRoles } from "../controllers/roles";
const router = Router();

router.get("/", getAllRoles);

export { router as roleRoutes };
