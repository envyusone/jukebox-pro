import "dotenv/config";
import express from "express";
import morgan from "morgan";

// 1. Import the new router and middleware
import usersRouter from "#api/users"; // You'll need to create this file
import tracksRouter from "#api/tracks";
import playlistsRouter from "#api/playlists";
import getUserFromToken from "#middleware/getUserFromToken";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// 2. Global Auth Middleware
// This must run BEFORE the routers so req.user is populated
app.use(getUserFromToken);

// 3. Routes
app.use("/users", usersRouter); // New endpoint for register/login
app.use("/tracks", tracksRouter);
app.use("/playlists", playlistsRouter);

// 4. Error Handling
app.use((err, req, res, next) => {
  switch (err.code) {
    case "22P02":
      return res.status(400).send(err.message);
    case "23505":
    case "23503":
      return res.status(400).send(err.detail);
    default:
      next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).send(err.message || "Sorry! Something went wrong.");
});

export default app;
