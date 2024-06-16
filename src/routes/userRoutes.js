import express from 'express';
import { registerUser, loginUser, getMe, logoutUser } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/me', protect, getMe);
userRouter.get('/logout', logoutUser);

export default userRouter;
