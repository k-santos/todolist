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

  it("should not create a user without name", async () => {
    const user = {
      username: "username",
      password: "password",
    };

    const response = await request(server.getApp())
      .post("/user/create")
      .send(user);
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it("should not create a user without username", async () => {
    const user = {
      name: "name",
      password: "password",
    };

    const response = await request(server.getApp())
      .post("/user/create")
      .send(user);
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it("should not create a user without password", async () => {
    const user = {
      name: "name",
      username: "username",
    };

    const response = await request(server.getApp())
      .post("/user/create")
      .send(user);
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it("should not create a user with a password shorter than 8 characters", async () => {
    const user = {
      name: "name",
      username: "username",
      password: "abcdefg",
    };

    const response = await request(server.getApp())
      .post("/user/create")
      .send(user);
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });
});
