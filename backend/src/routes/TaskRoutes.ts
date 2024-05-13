import express from "express";
import { TaskController } from "../controllers/TaskController";
import { verifyToken } from "../middleware/authMiddleware";

const taskRouters = express.Router();

taskRouters.post("/create/", verifyToken, TaskController.createTask);

export default taskRouters;
