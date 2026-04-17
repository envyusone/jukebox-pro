import express from "express";
import bcrypt from "bcrypt";
import { createToken } from "#utils/jwt";
import { createUser, getUserByUsername } from "#db/queries/users";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send("Username and password are required.");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(username, hashedPassword);
    const token = createToken({ id: user.id });

    res.status(201).send(token);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send("Username and password are required.");
  }

  try {
    const user = await getUserByUsername(username);
    const valid = user ? await bcrypt.compare(password, user.password) : false;

    if (!valid) {
      return res.status(401).send("Invalid credentials.");
    }

    const token = createToken({ id: user.id });
    res.send(token);
  } catch (error) {
    next(error);
  }
});

export default router;
