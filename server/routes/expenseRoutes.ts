import express from "express";
import {
  addExpense,
  deleteExpense,
  getGroupExpenses,
} from "../controllers/expenseControllers.js";
import { addExpenseSchema } from "../schemas/expenseSchema.js";
import { validate } from "../middlewares/validate.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import {
  generateSettlements,
  getSettlements,
  markSettled,
  unmarkSettled,
} from "../controllers/balanceControllers.js";

const expenseRouter = express.Router({ mergeParams: true });

expenseRouter.post(
  "/add",
  authMiddleware,
  validate(addExpenseSchema),
  addExpense,
);
expenseRouter.get("/", authMiddleware, getGroupExpenses);
expenseRouter.delete("/:expenseId", authMiddleware, isAdmin, deleteExpense);

expenseRouter.post(
  "/settlements/generate",
  authMiddleware,
  generateSettlements,
);
expenseRouter.get("/settlements", authMiddleware, getSettlements);
expenseRouter.patch(
  "/settlements/:settlementId/settle",
  authMiddleware,
  markSettled,
);
expenseRouter.patch(
  "/settlements/:settlementId/unsettle",
  authMiddleware,
  unmarkSettled,
);

export default expenseRouter;
