import express from "express";
import { LoginMiddleware, isAdmin } from "../middleware/authMiddleware.js";
import { createProductController, deleteProductController, getProductController, getSingleProductController, productPhotController, updateProductController } from "../controllers/ProductController.js";
import formidable from "express-formidable"

const router = express.Router();

// routes
router.post(
  "/create-product",
  LoginMiddleware,
  isAdmin,
  formidable(),
  createProductController
);

// update product
router.put(
    "/update-product/:pid",
    LoginMiddleware,
    isAdmin,
    formidable(),
    updateProductController
  );

// get products
router.get('/get-product', getProductController)

// single product
router.get('/get-product/:slug', getSingleProductController);

// get photo
router.get('/product-photo/:pid',productPhotController)

// delete product
router.delete('/delete-product/:pid',deleteProductController)

export default router