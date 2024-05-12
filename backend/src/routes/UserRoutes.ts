import express from "express";
import { UserController } from "../controllers/UserController";

const userRouters = express.Router();

userRouters.post("/create/", UserController.create);

export default userRouters;
