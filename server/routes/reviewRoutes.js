import { Router } from 'express';
import { auth, admin } from '../middlewares/authMiddleware.js';
import { createReview, updateReview, getBookReviews, deleteReview, getAllReviews } from '../controller/reviewController.js';

const router = Router();

router.get('/', auth, getAllReviews);
router.post('/:bookId', auth, createReview);
router.put('/:id', auth, updateReview);
router.get('/:bookId', getBookReviews);
router.delete('/:id', auth, deleteReview);

export default router;