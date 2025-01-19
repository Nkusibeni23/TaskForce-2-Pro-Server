import express from "express";
import {
  createExpense,
  getExpenses,
  deleteExpense,
} from "../controller/expenseController";
import { requireAuth } from "../middleware/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Expenses
 *     description: API for managing expenses
 */

/**
 * @swagger
 * /api/v1/add-expense:
 *   post:
 *     tags:
 *       - Expenses
 *     summary: add a new expense
 *     description: Creates a new expense entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - amount
 *               - category
 *               - date
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the expense
 *               amount:
 *                 type: number
 *                 description: The amount of the expense
 *               category:
 *                 type: string
 *                 description: The category of the expense
 *               description:
 *                 type: string
 *                 description: A description of the expense
 *               date:
 *                 type: string
 *                 format: date
 *                 description: The date the expense was incurred
 *     responses:
 *       201:
 *         description: Expense created successfully
 *       400:
 *         description: Missing required fields
 */
router.post("/add-expense", requireAuth, createExpense);

/**
 * @swagger
 * /api/v1/get-expenses:
 *   get:
 *     tags:
 *       - Expenses
 *     summary: Get all expenses
 *     description: Fetch all expense entries
 *     responses:
 *       200:
 *         description: A list of expenses
 *       500:
 *         description: Server error
 */
router.get("/get-expenses", requireAuth, getExpenses);
/**
 * @swagger
 * /api/v1/delete-expense/{id}:
 *   delete:
 *     tags:
 *       - Expenses
 *     summary: Delete an expense
 *     description: Delete an expense entry by its ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the expense to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Expense deleted successfully
 *       404:
 *         description: Expense not found
 */
router.delete("/delete-expense/:id", requireAuth, deleteExpense);

export default router;
