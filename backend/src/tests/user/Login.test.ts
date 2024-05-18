import request from "supertest";
import { Server } from "../../Server";
import { StatusCodes } from "http-status-codes";
import { cleanDatabase } from "../Utils";

let server: Server;

const user = {
  name: "name",
  username: "username",
  password: "password",
};

beforeAll(async () => {
  server = new Server(3333);
  server.start();
  await cleanDatabase();
  await request(server.getApp()).post("/user/create").send(user);
});

afterAll(async () => {
  await cleanDatabase();
  await server.stop();
});

describe("Login endpoint", () => {
  it("should login successfully", async () => {
    const response = await request(server.getApp()).post("/user/login").send({
      username: user.username,
      password: user.password,
    });
    expect(response.body.token).toBeDefined();
    expect(response.body.name).toBe(user.name);
    expect(response.status).toBe(StatusCodes.OK);
  });

  it("should not log in with the wrong password", async () => {
    const response = await request(server.getApp()).post("/user/login").send({
      username: user.username,
      password: "invalidPassword",
    });
    expect(response.body.message).toBe("Invalid username or password");
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });

  it("should not log in with the unregistered user", async () => {
    const response = await request(server.getApp()).post("/user/login").send({
      username: "invalidUser",
      password: user.password,
    });
    expect(response.body.message).toBe("User not found");
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });

  it("should not log in without username", async () => {
    const response = await request(server.getApp()).post("/user/login").send({
      password: user.password,
    });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it("should not log in without password", async () => {
    const response = await request(server.getApp()).post("/user/login").send({
      username: "invalidUser",
    });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });
});
