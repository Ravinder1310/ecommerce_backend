import slugify from "slugify";
import ProductModel from "../models/ProductModel.js";
import fs from "fs";

export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const {photo} = req.files;

    // validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res.status(500).send({ error: "Photo is required or should be less then 1mb" });
      default:
        break;
    }
    const product = new ProductModel({...req.fields, slug:slugify(name)});
    if(photo){
        product.photo.data = fs.readFileSync(photo.path)
        product.photo.contentType = photo.type
    }
    await product.save();
    res.status(201).send({
        success:true,
        product:"Product created successfully",
        product
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating product",
      error,
    });
  }
};

// get all products controller

export const getProductController = async (req, res) => {
  try {
    const products = await ProductModel.find({})
      .populate('category')
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      
      success: true,
      total:products.length,
      message: "All products",
      products
      
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting all products",
      error,
    });
  }
};

// get single products controller

export const getSingleProductController = async(req,res) => {
     try {
        const product = await ProductModel.findOne({ slug: req.params.slug })
          .select("-photo")
          .populate("category");
        res.status(200).send({
          success: true,
          message: "Single product Fetched",
          product,
        });
     } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error while getting single product",
            error
        })
     }
}

// get product photo

export const productPhotoController = async(req,res) => {
   try {
      const product = await ProductModel.findById(req.params.pid).select("photo");
      if(product.photo.data){
          res.set('Content-type', product.photo.contentType)
          return res.status(200).send(product.photo.data)
      }
   } catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        message:"Error in getting photo",
        error
    })
   }
}


// delete product controller

export const deleteProductController = async(req,res) => {
    try {
        await ProductModel.findByIdAndDelete(req.params.pid).select('-photo');
        res.status(200).send({
            success:true,
            message:"Product deleted successfully"
        })
    } catch (error) {
        console.log(error);
        res.statsu(500).send({
            success:false,
            message:"Error while deleting product",
            error
        })
    }
}


// update product controller

export const updateProductController = async(req,res) => {
    try {
        const { name, description, price, category, quantity, shipping } =
          req.fields;
        const {photo} = req.files;
    
        // validation
        switch (true) {
          case !name:
            return res.status(500).send({ error: "Name is Required" });
          case !description:
            return res.status(500).send({ error: "Description is Required" });
          case !price:
            return res.status(500).send({ error: "Price is Required" });
          case !category:
            return res.status(500).send({ error: "Category is Required" });
          case !quantity:
            return res.status(500).send({ error: "Quantity is Required" });
          case photo && photo.size > 1000000:
            return res.status(500).send({ error: "Photo is required or should be less then 1mb" });
          default:
            break;
        }
        const product = await ProductModel.findByIdAndUpdate(
          req.params.pid,
          { ...req.fields, slug: slugify(name) },
          { new: true }
        );
        if(photo){
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contentType = photo.type
        }
        await product.save();
        res.status(201).send({
            success:true,
            product:"Product updated successfully",
            product
        })
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error in updating product",
          error,
        });
      }
}
