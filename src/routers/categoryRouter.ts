import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../controller/categoryController";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the category
 *         name:
 *           type: string
 *           description: The name of the category
 *         parentCategory:
 *           type: string
 *           description: The ID of the parent category (if it's a subcategory)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation date of the category
 *       example:
 *         id: 60b6c0f5f9d3e843d4e8c8b4
 *         name: Electronics
 *         parentCategory: null
 *         createdAt: 2025-01-17T14:32:00Z
 */

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API for managing categories and subcategories
 */

/**
 * @swagger
 * /add-category:
 *   post:
 *     summary: Create a new category or subcategory
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: The category was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Failed to create the category
 */
router.post("/add-category", createCategory);

/**
 * @swagger
 * /get-categories:
 *   get:
 *     summary: Retrieve all categories and subcategories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: A list of all categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Failed to retrieve categories
 */
router.get("/get-categories", getAllCategories);

/**
 * @swagger
 * /get-category/{id}:
 *   get:
 *     summary: Retrieve a specific category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID
 *     responses:
 *       200:
 *         description: The category details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *       500:
 *         description: Failed to retrieve category
 */
router.get("/get-category/:id", getCategoryById);

/**
 * @swagger
 * /update-categories/{id}:
 *   put:
 *     summary: Update a category or subcategory by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: The updated category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *       500:
 *         description: Failed to update category
 */
router.put("/update-categories/:id", updateCategory);

/**
 * @swagger
 * /delete-categories/{id}:
 *   delete:
 *     summary: Delete a category or subcategory by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Failed to delete category
 */
router.delete("/delete-categories/:id", deleteCategory);

export default router;
