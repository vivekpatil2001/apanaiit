import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import userRoutes from "./routes/user.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

dotenv.config({
  path: "./.env",
});

const app = express();

// app.use(express.json)

app.use(
  cors()
);

app.use(cookieParser());

app.use(morgan("dev"));

app.use("/ping", function (req, res) {
  res.send("pong");
});

//routes of 3 modules

app.use('/api/v1/user', userRoutes)

app.all("*", (req, res) => {
  res.status(404).send("OOPS!! 404 page not found");
});

app.use(errorMiddleware);
export default app;
