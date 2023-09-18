import express from "express";
import { LoginMiddleware, isAdmin } from "../middleware/authMiddleware.js";
import { BraintreePaymentController, BraintreeTokenController, createProductController, deleteProductController, getProductController, getSingleProductController, productCategoryController, productCountController, productFilterController, productListController, productPhotoController, searchProductController, similarProductController, updateProductController } from "../controllers/ProductController.js";
import formidable from "express-formidable"
import { BraintreeGateway } from "braintree";

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
router.get('/product-photo/:pid',productPhotoController)

// delete product
router.delete('/delete-product/:pid',deleteProductController);

// filtered products
router.post('/product-filter', productFilterController);

// product count
router.get('/product-count', productCountController)

// products per page
router.get('/product-list/:page', productListController)

// search product
router.get('/search/:keyword', searchProductController);

// similar peoducts
router.get('/similar-product/:pid/:cid', similarProductController);

// product according to single category
router.get('/product-category/:slug', productCategoryController);

//payment routes
// token
router.get('/braintree/token', BraintreeTokenController);

//payments
router.post('/braintree/payment', LoginMiddleware, BraintreePaymentController)

export default router