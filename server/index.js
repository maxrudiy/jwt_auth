import express from "express";
import cors from "cors";
//"dotenv/config"; - for correct work of .env with ES6 import
import "dotenv/config";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import helmet from "helmet";
import mongoose from "mongoose";
import router from "./routes/auth-routes.js";
import { errorLogger, errorResponce } from "./middlewares/errors-middleware.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5001;

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/auth", router);
app.use(errorLogger);
app.use(errorResponce);

const start = async () => {
  try {
    await new Promise((resolve, reject) => {
      mongoose.connect(process.env.DB_URL, { maxPoolSize: 10 });
      mongoose.connection
        .on("connected", () => {
          console.log("Connected to database");
          return resolve();
        })
        .on("error", (err) => reject(err));
    });
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (err) {
    console.log(err);
  }
};
start();
