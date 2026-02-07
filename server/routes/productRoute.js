import express from 'express';
import { upload } from '../configs/multer.js';
import authSeller from '../middlewares/authSeller.js';
import { AddProduct, ChangeStock, ProductById, productList, deleteProduct, updateOrderStatus, updateProduct } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post('/add', upload.array('images'), authSeller, AddProduct);
productRouter.get('/list', productList);
productRouter.get('/id', ProductById);
productRouter.post('/stock', authSeller, ChangeStock);
productRouter.delete('/delete/:id', authSeller, deleteProduct);
productRouter.post('/update-status', authSeller, updateOrderStatus);
productRouter.post('/update', authSeller, updateProduct);


export default productRouter;
