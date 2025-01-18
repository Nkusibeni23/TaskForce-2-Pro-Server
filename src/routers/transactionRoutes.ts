import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getTransactionById,
  getTransactions,
} from "../controller/transactionController";
import { requireAuth } from "../middleware/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 */

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: API for managing transactions
 */

/**
 * @swagger
 * /add-transaction:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     summary: Create a new transaction
 *     description: Create a transaction with the specified details.
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               account:
 *                 type: string
 *                 description: Account ID
 *               category:
 *                 type: string
 *                 description: Category ID
 *               description:
 *                 type: string
 *             required:
 *               - amount
 *               - type
 *               - account
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Missing required fields
 */
router.post("/add-transaction", requireAuth, createTransaction);

/**
 * @swagger
 * /get-transactions:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     summary: Get all transactions
 *     description: Retrieve all transactions for the authenticated user
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by start date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by end date (YYYY-MM-DD)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *         description: Filter by transaction type
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of transactions
 *       401:
 *         description: Unauthorized
 */
router.get("/get-transactions", requireAuth, getTransactions);

/**
 * @swagger
 * /get-transaction/{id}:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     summary: Get a transaction by ID
 *     description: Retrieve a specific transaction by its ID
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Transaction ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 */
router.get("/get-transaction/:id", requireAuth, getTransactionById);

/**
 * @swagger
 * /delete-transaction/{id}:
 *   delete:
 *     security:
 *       - BearerAuth: []
 *     summary: Delete a transaction
 *     description: Delete a transaction by its ID
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Transaction ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 */
router.delete("/delete-transaction/:id", requireAuth, deleteTransaction);

export default router;
