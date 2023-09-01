import { ComparePassword, HashPassword } from "../helper/authHelper.js";
import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken"


export const registerController = async(req,res) => {
    try {
        const {name,email,password,phone,address} = req.body;

        if(!name){
           return res.send({error:"Name is required"})
        }
        if(!email){
            return res.send({error:"Email is required"})
         }
         if(!password){
            return res.send({error:"Password is required"})
         }
         if(!phone){
            return res.send({error:"Phone no. is required"})
         }
         if(!address){
            return res.send({error:"Address is required"})
         }

        // checking user
        const existingUser = await UserModel.findOne({email})
         
         // existing user
        if(existingUser){
          return res.send(200).send({
            success:true,
            message:"Already Register please login"
          })
        }

        // register user
        const hashedPassword = await HashPassword(password);
        //save
        const user = await new UserModel({name,email,phone,address,password:hashedPassword}).save();
        res.status(200).send({
            success:true,
            message:"User Registered succesfully",
            user,
        })

    } catch (error) {
        console.log(error);
        res.send(500).send({
            success:false,
            message:"Error in Registeration",
            error
        })
    }
}

// POST LOGIN

export const loginController = async(req,res) => {
   try {
    const {email,password} = req.body
    //validation 
    if(!email || !password){
        return res.status(404).send({
            success:false,
            message:"Invalid email or password"
        })
    }
    //check user
    const user = await UserModel.findOne({email});
    if(!user){
        return res.status(500).send({
            success:false,
            message:"Email is not registered"
        })
    }
    const match = await ComparePassword(password,user.password)
    if(!match){
        return res.status(200).send({
            success:false,
            message:"Invalid password"
        })
    }

    //token
    const token = await jwt.sign({_id:user._id},process.env.JWT_SECRET,{
        expiresIn:"7d"
    });

    res.status(200).send({
            success:true,
            message:"Login succesfully",
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address
            },
            token
    })

   } catch (error) {
      console.log(error);
      res.send(500).send({
        success:false,
        message:"Error in Login",
        error
      })
   }
}


