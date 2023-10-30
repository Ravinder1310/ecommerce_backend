import slugify from "slugify";
import ProductModel from "../models/ProductModel.js";
import fs from "fs";
import CategoryModel from "../models/CategoryModel.js";
import braintree from "braintree";
import OrderModel from "../models/OrderModel.js";
import dotenv from "dotenv"

dotenv.config();

// payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox, 
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// create product controller
export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photos } = req.files;

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
      // case photos && photos.size > 1000000:
      //   return res
      //     .status(500)
      //     .send({ error: "Photo is required or should be less then 1mb" });
      default:
        break;
    }
    const product = new ProductModel({ ...req.fields, slug: slugify(name) });
    if (photos) {
      product.photos = photos.map((photo) => ({
        data: fs.readFileSync(photo.path),
        contentType: photo.type,
      }));
    }
    await product.save();
    res.status(201).send({
      success: true,
      product: "Product created successfully",
      product,
    });
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
      .populate("category")
      .select("-photos.data")
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      total: products.length,
      message: "All products",
      products,
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
export const getSingleProductController = async (req, res) => {
  try {
    const product = await ProductModel.findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category",'brand');
    res.status(200).send({
      success: true,
      message: "Single product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting single product",
      error,
    });
  }
};

// get product photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting photo",
      error,
    });
  }
};

// delete product controller
export const deleteProductController = async (req, res) => {
  try {
    await ProductModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.statsu(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

// update product controller
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

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
        return res
          .status(500)
          .send({ error: "Photo is required or should be less then 1mb" });
      default:
        break;
    }
    const product = await ProductModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(201).send({
      success: true,
      product: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating product",
      error,
    });
  }
};

// product filter controller
export const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await ProductModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in filtering products",
      error,
    });
  }
};

// product count controller
export const productCountController = async (req, res) => {
  try {
    const total = await ProductModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while counting the products",
      error,
    });
  }
};

// product list controller
export const productListController = async (req, res) => {
  try {
    const perPage = 10;
    const page = req.params.page ? req.params.page : 1;
    const products = await ProductModel.find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
      res.status(200).send({
        success:true,
        products
      })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in per page control",
      error,
    });
  }
};

// search product controller
export const searchProductController = async(req,res) => {
  try {
    const {keyword} = req.params;
    const results = await ProductModel.find({
      $or:[
        {name:{$regex :keyword, $options:"i"}},
        {description:{$regex :keyword, $options:"i"}}
      ]
    }).select('-photo');
    res.json(results)
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while searching product",
      error,
    });
  }
}

// similar product controller
export const similarProductController = async(req,res) => {
  try {
    const {pid,cid} = req.params;
    const products = await ProductModel.find({
      category:cid,
      _id:{$ne:pid}
    }).select('-photo').limit(3).populate('category');
    res.status(200).send({
      success:true,
      products
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success:false,
      message:"Error while fetching similar products",
      error
    })
  }
}

// product category controller
export const productCategoryController = async(req,res) => {
  try {
    const category = await CategoryModel.findOne({slug:req.params.slug});
    const products = await ProductModel.find({category}).populate('category');
    res.status(200).send({
      success:true,
      category,
      products
    })
  } catch (error) {
    console.log(error);;
    res.status(500).send({
      success:false,
      message:"Error in getting products according to single category",
      error
    })
  }
}

// payment gateway controller
export const BraintreeTokenController = async(req,res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

// payment controller
export const BraintreePaymentController = async(req,res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new OrderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
}