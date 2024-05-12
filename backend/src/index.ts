import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import userRouters from "./routes/UserRoutes";

export const app = express();
app.use(bodyParser.json());
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/user", userRouters);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
