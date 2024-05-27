import request from "supertest";
import { Server } from "../../Server";
import { StatusCodes } from "http-status-codes";
import { cleanDatabase } from "../Utils";
import { prismaClient } from "../../lib/Client";

let server: Server;
let token = "";
const user = {
  name: "name",
  username: "username",
  password: "password",
};

beforeAll(() => {
  server = new Server();
});

beforeEach(async () => {
  await cleanDatabase();
  await request(server.getApp()).post("/user/create").send(user);

  const loginResponse = await request(server.getApp())
    .post("/user/login")
    .send({
      username: user.username,
      password: user.password,
    });
  token = loginResponse.body.token;
});

afterAll(async () => {
  await cleanDatabase();
  await prismaClient.$disconnect();
});

describe("Find user endpoint", () => {
  it("should find user from token", async () => {
    const response = await request(server.getApp())
      .get("/user/find")
      .set("authorization", `Bearer ${token}`);

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.name).toBe(user.name);
    expect(response.body.username).toBe(user.username);
  });
});
