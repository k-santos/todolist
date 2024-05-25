import express from "express";
import { UserController } from "../controllers/UserController";
import { verifyToken } from "../middleware/authMiddleware";

const userRouters = express.Router();

userRouters.post("/create/", UserController.create);

userRouters.post("/login/", UserController.login);

userRouters.get("/find/", verifyToken, UserController.findUser);

export default userRouters;
