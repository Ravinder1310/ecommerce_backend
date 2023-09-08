import express from "express";
import { LoginMiddleware, isAdmin } from "../middleware/authMiddleware.js";
import { createProductController } from "../controllers/ProductController.js";
import formidable from "express-formidable"

const router = express.Router();

router.post("/create-product",LoginMiddleware, isAdmin,formidable(), createProductController);

export default router