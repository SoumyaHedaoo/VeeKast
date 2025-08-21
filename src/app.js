import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { reqLimit } from "./constant";


//create a express application instance
const app=express();


//required standard middlewares
app.use(cors({                         // allows frontend deployed of diff origin access backend api
    origin : process.env.CORS_ORIGIN,
    credentials : true,
}));
app.use(express.json({limit : `${reqLimit}`})); //parse incomming req bodies , limits incomming request
app.use(express.urlencoded({
    extended : true , 
    limit : `${reqLimit}`,
}));
app.use(express.static("public")); // serves static files from "public" folder
app.use(cookieParser()); // makes users cookie accessible


export {app};