import express from "express";
import { generateReport } from "../controller/transactionReportController";

const router = express.Router();

router.get("/transactions/report", generateReport);

export default router;
