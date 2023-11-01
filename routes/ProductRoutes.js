import express from "express";
import { LoginMiddleware, isAdmin } from "../middleware/authMiddleware.js";
import { BraintreePaymentController, BraintreeTokenController, createProductController, deleteProductController, getProductController, getSingleProductController, productCategoryController, productCountController, productFilterController, productListController, productPhotoController, searchProductController, similarProductController, updateProductController } from "../controllers/ProductController.js";
import formidable from "express-formidable"
import { BraintreeGateway } from "braintree";
import multer from "multer";
import path from "path"; 

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "path_to_your_photo_directory");
  },
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    callback(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Adjust the file size limit as needed
});

// routes
router.post(
  "/create-product",
  LoginMiddleware,
  isAdmin,
  upload.array("photos", 5),
  formidable(),
  createProductController
);

// update product
router.put(
    "/update-product/:pid",
    LoginMiddleware,
    isAdmin,
    upload.array("photos", 5),
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