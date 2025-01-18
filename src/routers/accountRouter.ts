import express from "express";
import {
  createAccount,
  deleteAccount,
  getAccountById,
  getAllAccounts,
  updateAccount,
} from "../controller/accountController";
import { requireAuth } from "../middleware/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Account:
 *       type: object
 *       required:
 *         - name
 *         - type
 *         - balance
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the account
 *         name:
 *           type: string
 *           description: The name of the account
 *         type:
 *           type: string
 *           description: The type of the account (e.g., bank, mobile money, cash)
 *         balance:
 *           type: number
 *           description: The current balance of the account
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the account was created
 *       example:
 *         id: 60b6c0f5f9d3e843d4e8c8b4
 *         name: Savings Account
 *         type: bank
 *         balance: 1000.50
 *         createdAt: 2025-01-17T14:32:00Z
 */

/**
 * @swagger
 * tags:
 *   name: Accounts
 *   description: API for managing accounts
 */

/**
 * @swagger
 * /add-account:
 *   post:
 *     summary: Create a new account
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Account'
 *     responses:
 *       201:
 *         description: The account was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Failed to create the account
 */
router.post("/add-account", requireAuth, createAccount);

/**
 * @swagger
 * /get-accounts:
 *   get:
 *     summary: Retrieve all accounts
 *     tags: [Accounts]
 *     responses:
 *       200:
 *         description: A list of all accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Account'
 *       500:
 *         description: Failed to retrieve accounts
 */
router.get("/get-accounts", requireAuth, getAllAccounts);

/**
 * @swagger
 * /get-account/{id}:
 *   get:
 *     summary: Retrieve an account by ID
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The account ID
 *     responses:
 *       200:
 *         description: The account details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       404:
 *         description: Account not found
 *       500:
 *         description: Failed to retrieve the account
 */
router.get("/get-account/:id", requireAuth, getAccountById);

/**
 * @swagger
 * /update-account/{id}:
 *   put:
 *     summary: Update an account by ID
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The account ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Account'
 *     responses:
 *       200:
 *         description: The updated account details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       404:
 *         description: Account not found
 *       500:
 *         description: Failed to update the account
 */
router.put("/update-account/:id", requireAuth, updateAccount);

/**
 * @swagger
 * /delete-account/{id}:
 *   delete:
 *     summary: Delete an account by ID
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The account ID
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       404:
 *         description: Account not found
 *       500:
 *         description: Failed to delete the account
 */
router.delete("/delete-account/:id", requireAuth, deleteAccount);

export default router;
