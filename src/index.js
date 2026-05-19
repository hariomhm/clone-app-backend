import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config(
    {
        path: "./.env"
    }
);

connectDB()
