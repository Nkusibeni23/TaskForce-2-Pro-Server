import express from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { budgetController } from "../controller/budgetController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Budget
 *   description: API for managing budgets
 */

/**
 * @swagger
 * /get-budgets:
 *   get:
 *     summary: Get all active budgets
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active budgets
 */
router.get("/get-budgets", requireAuth, budgetController.getBudgets);
/**
 * @swagger
 * /budget/get-all-budgets:
 *   get:
 *     summary: Get all budgets (including inactive)
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all budgets
 */
router.get("/get-all-budgets", requireAuth, budgetController.getAllBudgets);

/**
 * @swagger
 * /add-budget:
 *   post:
 *     summary: Create a new budget
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Budget name
 *                 example: Marketing Budget
 *               amount:
 *                 type: number
 *                 description: Budget amount
 *                 example: 5000
 *     responses:
 *       201:
 *         description: Budget created successfully
 */
router.post("/add-budget", requireAuth, budgetController.createBudget);

/**
 * @swagger
 * /update-budget/{id}:
 *   put:
 *     summary: Update budget details
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Budget ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated budget name
 *               amount:
 *                 type: number
 *                 description: Updated budget amount
 *     responses:
 *       200:
 *         description: Budget updated successfully
 */
router.put("/update-budget/:id", requireAuth, budgetController.updateBudget);

/**
 * @swagger
 * /delete-budget/{id}:
 *   delete:
 *     summary: Delete (mark as inactive) a budget
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Budget ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Budget marked as inactive
 */
router.delete("/delete-budget/:id", requireAuth, budgetController.deleteBudget);

/**
 * @swagger
 * /delete-budget/{budgetId}/spending:
 *   post:
 *     summary: Update budget spending
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: budgetId
 *         in: path
 *         required: true
 *         description: Budget ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amountSpent:
 *                 type: number
 *                 description: Amount spent
 *     responses:
 *       200:
 *         description: Budget spending updated
 */
router.post(
  "/delete-budget/:budgetId/spending",
  requireAuth,
  budgetController.updateBudgetSpending
);

/**
 * @swagger
 * /budgets/check-expired:
 *   post:
 *     summary: Manually check for expired budgets
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Expired budgets checked successfully
 */
router.post(
  "/budgets/check-expired",
  requireAuth,
  budgetController.checkExpiredBudgets
);

router.get("/test-budget", (req, res) => {
  res.json({ message: "Budget router working" });
});

export default router;
