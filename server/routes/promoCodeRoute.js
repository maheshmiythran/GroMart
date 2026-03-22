import express from 'express';
import { createPromoCode, getPromoCodes, updatePromoCode, deletePromoCode, validatePromoCode } from '../controllers/promoCodeController.js';
import authSeller from '../middlewares/authSeller.js';
import authUser from '../middlewares/authUser.js';

const promoCodeRouter = express.Router();

// Seller Routes
promoCodeRouter.post('/create', authSeller, createPromoCode);
promoCodeRouter.get('/list', authSeller, getPromoCodes);
promoCodeRouter.post('/update', authSeller, updatePromoCode);
promoCodeRouter.post('/delete', authSeller, deletePromoCode);

// Client Routes
promoCodeRouter.post('/validate', authUser, validatePromoCode);

export default promoCodeRouter;
