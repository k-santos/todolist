import request from "supertest";
import { Server } from "../../Server";
import { StatusCodes } from "http-status-codes";
import { cleanDatabase } from "../Utils";

let server: Server;

beforeAll(async () => {
  server = new Server(3333);
  server.start();
  await cleanDatabase();
});

afterAll(async () => {
  await cleanDatabase();
  await server.stop();
});

describe("Create user endpoint", () => {
  it("should create a user", async () => {
    const user = {
      name: "Name",
      username: "username",
      password: "password",
    };

    const response = await request(server.getApp())
      .post("/user/create")
      .send(user);
    expect(response.status).toBe(StatusCodes.CREATED);
  });
});
