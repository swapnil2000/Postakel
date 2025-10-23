import { Router } from "express";
import { getCategories } from "../controllers/categories";
const router = Router();

router.get("/", getCategories);

export { router as categoryRoutes };
