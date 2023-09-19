import slugify from "slugify";
import BrandModel from "../models/BrandModel.js";

export const createBrandController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({
        message: "Name is required",
      });
    }
    const existingBrand = await BrandModel.findOne({ name });
    if (existingBrand) {
      return res.status(200).send({
        success: true,
        message: "Brand already existing",
      });
    }
    const brand = await new BrandModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "New brand created",
      brand,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Brand",
    });
  }
};

// update brand

export const updateBrandController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const brand = await BrandModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Brand Updated Successfully",
      brand,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating",
    });
  }
};

// get all brand

export const brandController = async (req, res) => {
  try {
    const brand = await BrandModel.find({});
    res.status(200).send({
      success: true,
      message: "All brands List",
      brand,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all brands",
    });
  }
};

// single brand controller

export const singleBrandController = async (req, res) => {
  try {
    const brand = await BrandModel.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "Get single brand successfully",
      brand,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting Single brand",
      error,
    });
  }
};

// delete brand controller

export const deleteBrandController = async (req, res) => {
  try {
    const { id } = req.params;
    await BrandModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "brand delted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in deleteing brand",
      error,
    });
  }
};
