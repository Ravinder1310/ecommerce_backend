import express from "express";
import { LoginMiddleware, isAdmin } from "../middleware/authMiddleware.js";
import { loginController } from "../controllers/authController.js";
import { brandController, createBrandController, deleteBrandController, singleBrandController, updateBrandController } from "../controllers/BrandController.js";

const router = express.Router();

router.post(
  "/create-brand",
  LoginMiddleware,
  isAdmin,
  createBrandController
);

// update brand
router.put(
  "/update-brand/:id",
  LoginMiddleware,
  isAdmin,
  updateBrandController
);


// get all brand
router.get("/get-brand", brandController);


// single brand
router.get("/single-brand/:slug", singleBrandController);


// delete brand
router.delete("/delete-brand/:id",LoginMiddleware,isAdmin,deleteBrandController)


export default router