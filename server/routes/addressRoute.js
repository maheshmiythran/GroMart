import express from 'express';
import authUser from '../middlewares/authUser.js';
import {
  addAddress,
  getAddress,
  getAddressById,
  editAddress,
  deleteAddress,
} from '../controllers/addressController.js';

const addressRouter = express.Router();

// Routes
addressRouter.post('/add', authUser, addAddress);           // POST /api/address/add
addressRouter.get('/get', authUser, getAddress);            // GET  /api/address/get?userId=xyz
addressRouter.get('/:id', authUser, getAddressById);        // GET  /api/address/:id
addressRouter.put('/edit/:id', authUser, editAddress);      // PUT  /api/address/edit/:id
addressRouter.delete('/delete/:id', authUser, deleteAddress); // DELETE /api/address/delete/:id

export default addressRouter;
