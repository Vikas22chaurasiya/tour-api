import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import packagesRoute from "./routes/packages.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import recommendationsRoute from "./routes/recommendation.js"
import favoritesRoute from "./routes/favorites.js"

const app = express();
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

//middlewares
app.use(cors())
// const allowedOrigins = ['https://tour-client.onrender.com', 'https://trip-venture.netlify.app'];

// // Configure CORS with multiple origins
// app.use(cors({
//   origin: function (origin, callback) {
//     // Check if the request origin is in the allowedOrigins array
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   }
// }));
app.use(cookieParser())
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/packages",packagesRoute);
app.use("/api/recommendations",recommendationsRoute);
app.use("/api/favorites",favoritesRoute);


app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(8800, () => {
  connect();
  console.log("Connected to backend.");
});
