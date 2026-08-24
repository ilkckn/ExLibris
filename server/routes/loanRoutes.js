import { Router } from "express";
import { auth, admin } from "../middlewares/authMiddleware.js";
import { getAllLoans, getMyLoans, createLoan, returnLoan } from "../controller/loanController.js";

const router = Router();

router.get("/", auth, admin, getAllLoans);
router.get("/my-loans", auth, getMyLoans);
router.post("/:bookId", auth, createLoan);
router.put("/:id/return", auth, returnLoan);

export default router;