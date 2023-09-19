import express from 'express';
import dotenv from "dotenv";
import morgan from 'morgan';
import Connection  from './config/db.js';
import router from './routes/authRoute.js';
import CategoryRoutes from "./routes/CategoryRoutes.js"
import BrandRoutes from "./routes/BrandRoutes.js"
import ProductRoutes from "./routes/ProductRoutes.js"
import cors from "cors";

//configure env
dotenv.config();

//database config
Connection();

// rest obj

const app = express();
app.use(cors())
app.use(express.json())
app.use(morgan('dev'));

// routes
app.use('/api/v1/auth',router);
app.use('/api/v1/category', CategoryRoutes);
app.use('/api/v1/brand', BrandRoutes);
app.use('/api/v1/product',ProductRoutes)


app.get("/", (req,res)=>{
    res.send({
        message:"Welcome to ecommerce"
    })
})

app.listen(process.env.PORT,()=>{
    console.log(`Server is running in port ${process.env.PORT}`);
})