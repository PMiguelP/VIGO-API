const express = require("express");
const cookieParser = require("cookie-parser");
const corsMiddleware = require("./middlewares/cors.middleware");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);

module.exports = app;
