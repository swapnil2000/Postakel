import { Router } from "express";
import { getAllTables, createTable, updateTable, deleteTable } from "../controllers/table";
const router = Router();
router.get("/", getAllTables);
router.post("/", createTable);
router.put("/:id", updateTable);
router.delete("/:id", deleteTable);
export { router as tableRoutes };
