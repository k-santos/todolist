import express, { Request, Response, Application } from "express";
import bodyParser from "body-parser";
import userRouters from "./routes/UserRoutes";
import dotenv from "dotenv";
import taskRouters from "./routes/TaskRoutes";
import cors from "cors";
import { Server as HTTPServer } from "http";

dotenv.config();

export class Server {
  private app: Application;
  private port: number;
  private server?: HTTPServer;

  constructor(port: number = 3333) {
    this.app = express();
    this.port = port;
    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware(): void {
    this.app.use(cors());
    this.app.use(bodyParser.json());
  }

  private configureRoutes(): void {
    this.app.get("/", (req: Request, res: Response) => {
      res.send("Hello World!");
    });
    this.app.use("/user", userRouters);
    this.app.use("/task", taskRouters);
  }

  public start(): void {
    this.server = this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }

  public async stop(): Promise<void> {
    if (this.server) {
      await new Promise<void>((resolve, reject) => {
        this.server!.close((err) => {
          if (err) {
            return reject(err);
          }
          console.log("Server stopped");
          resolve();
        });
      });
    } else {
      console.log("Server is not running");
    }
  }

  public getApp(): Application {
    return this.app;
  }
}
