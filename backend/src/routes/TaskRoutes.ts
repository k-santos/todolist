import express from "express";
import { TaskController } from "../controllers/TaskController";
import { verifyToken } from "../middleware/authMiddleware";

const taskRouters = express.Router();

taskRouters.post("/create/", verifyToken, TaskController.createTask);

taskRouters.post("/finish/", verifyToken, TaskController.finishTask);

taskRouters.post("/undo/", verifyToken, TaskController.undoTask);

taskRouters.get("/find/", verifyToken, TaskController.findTasks);

export default taskRouters;
