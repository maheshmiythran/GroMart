import express from 'express';
import authUser from '../middlewares/authUser.js';
import { addAddress, getAddress, editAddress, deleteAddress, getAddressById} from '../controllers/addressController.js';

const addressRouter = express.Router();

addressRouter.post('/add', authUser, addAddress);
addressRouter.get('/get', authUser, getAddress);
addressRouter.get('/:id', authUser, getAddressById);
addressRouter.put('/edit/:id', authUser, editAddress);
addressRouter.delete('/delete/:id', authUser, deleteAddress);




export default addressRouter;