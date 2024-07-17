import express from 'express';
import { registerUser, loginUser, getMe, logoutUser } from '../controllers/userController.js';
import checkJwt from '../middlewares/authMiddleware.js'; // Ensure this is the correct import

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/me', checkJwt, getMe); // Use checkJwt to protect this route
userRouter.get('/logout', logoutUser);

export default userRouter;
