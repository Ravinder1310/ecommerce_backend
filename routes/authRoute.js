import express from "express"
import {registerController,loginController, forgotPasswordController}  from "../controllers/authController.js"
import { LoginMiddleware, isAdmin } from "../middleware/authMiddleware.js";

// router obj
const router = express.Router();

// routing
// Register || METHOD POST

router.post('/register',registerController);

// Login || METHOD POST

router.post('/login', loginController);

// forgot password

router.post('/forgot-password', forgotPasswordController)

// protected route auth

router.get('/user-auth',LoginMiddleware, (req,res) => {
    res.status(200).send({ok:true}); 
})

// protected route auth

router.get('/admin-auth',LoginMiddleware,isAdmin, (req,res) => {
    res.status(200).send({ok:true}); 
})

export default router;