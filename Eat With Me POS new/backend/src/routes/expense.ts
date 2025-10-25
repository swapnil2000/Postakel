import { Router } from "express";
import {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  searchExpenses,
  getExpenseStats
} from "../controllers/expense";

const router = Router();

router.get("/", getAllExpenses);
router.get("/search", searchExpenses);
router.get("/stats", getExpenseStats);
router.get("/:id", getExpenseById);
router.post("/", createExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export { router as expenseRoutes };
