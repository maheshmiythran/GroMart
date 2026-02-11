import express from 'express';
import { isAuth, login, logout, register, getAllUsers, deleteUser, updateUser, updateProfile, deleteMyAccount } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import authSeller from '../middlewares/authSeller.js';

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/is-auth', authUser, isAuth);
userRouter.get('/logout', logout);
userRouter.get('/all-users', authSeller, getAllUsers);
userRouter.post('/delete', authSeller, deleteUser);
userRouter.post('/update', authSeller, updateUser);

userRouter.put('/update-profile', authUser, updateProfile);
userRouter.delete('/delete-account', authUser, deleteMyAccount);

export default userRouter;