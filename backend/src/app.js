const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const errorHandler = require("./middleware/error.middleware");

const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const commentRoutes = require("./routes/comment.routes");

const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

app.get("/api/health", (req, res) => res.json({ status: "OK" }));

app.use(errorHandler);

module.exports = app;
