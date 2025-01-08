const express = require("express");
const cookieParser = require("cookie-parser");
const corsMiddleware = require("./middlewares/cors.middleware");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const eventRoutes = require("./routes/eventRoutes");
const itineraryRoutes = require("./routes/itineraryRoutes");
const checklistRoutes = require("./routes/checklistRoutes");
const checklistItemRoutes = require("./routes/checklistItemRoutes");
const commentRoutes = require("./routes/commentsRoutes");
const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());

const apiRouter = express.Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/user", userRoutes);
apiRouter.use("/event", eventRoutes);
apiRouter.use("/teste", itineraryRoutes);
apiRouter.use("/checklist", checklistRoutes);
apiRouter.use("/item", checklistItemRoutes);
apiRouter.use("/comment", commentRoutes);

app.use("/api", apiRouter);

module.exports = app;
