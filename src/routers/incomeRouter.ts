import express from "express";
import {
  createIncome,
  getIncomes,
  deleteIncome,
} from "../controller/incomeController";
import { requireAuth } from "../middleware/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Incomes
 *   description: API for managing incomes
 */

/**
 * @swagger
 * /api/v1/add-income:
 *   post:
 *     summary: Add a new income
 *     description: Creates a new income entry
 *     tags: [Incomes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Income created successfully
 *       400:
 *         description: Bad request
 */
router.post("/add-income", requireAuth, createIncome);

/**
 * @swagger
 * /api/v1/get-incomes:
 *   get:
 *     summary: Get all incomes
 *     description: Fetch all income entries
 *     tags: [Incomes]
 *     responses:
 *       200:
 *         description: List of incomes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/get-incomes", requireAuth, getIncomes);
/**
 * @swagger
 * /api/v1/delete-income/{id}:
 *   delete:
 *     summary: Delete an income
 *     description: Delete an income entry by its ID
 *     tags: [Incomes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The income ID
 *     responses:
 *       200:
 *         description: Income deleted successfully
 *       404:
 *         description: Income not found
 */
router.delete("/delete-income/:id", requireAuth, deleteIncome);

export default router;
