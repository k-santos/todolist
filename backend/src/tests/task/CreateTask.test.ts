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

describe("Create task endpoint", () => {
  it("should create a simple task", async () => {
    const simpleTask = {
      name: "Simple task",
    };

    const response = await request(server.getApp())
      .post("/task/create")
      .set("authorization", `Bearer ${token}`)
      .send(simpleTask);

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.name).toBe(simpleTask.name);
    const userDB = await prismaClient.user.findUnique({
      where: {
        username: user.username,
      },
    });
    expect(response.body.userId).toBe(userDB?.id);
    expect(response.body.value).toBe(undefined);
    expect(response.body.unit).toBe(undefined);
  });

  it("should create a task with integer value and unit", async () => {
    const task = {
      name: "Read a book",
      value: 10,
      unit: "pages",
    };

    const response = await request(server.getApp())
      .post("/task/create")
      .set("authorization", `Bearer ${token}`)
      .send(task);

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.name).toBe(task.name);
    expect(response.body.value).toBe(task.value);
    expect(response.body.unit).toBe(task.unit);
    const userDB = await prismaClient.user.findUnique({
      where: {
        username: user.username,
      },
    });
    expect(response.body.userId).toBe(userDB?.id);
  });

  it("should create a task with decimal value and unit", async () => {
    const task = {
      name: "Take a walk",
      value: 2.5,
      unit: "km",
    };

    const response = await request(server.getApp())
      .post("/task/create")
      .set("authorization", `Bearer ${token}`)
      .send(task);

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.name).toBe(task.name);
    expect(response.body.value).toBe(task.value);
    expect(response.body.unit).toBe(task.unit);
    const userDB = await prismaClient.user.findUnique({
      where: {
        username: user.username,
      },
    });
    expect(response.body.userId).toBe(userDB?.id);
  });

  it("should not create a task without name", async () => {
    const task = {
      value: 10,
      unit: "pages",
    };

    const response = await request(server.getApp())
      .post("/task/create")
      .set("authorization", `Bearer ${token}`)
      .send(task);

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it("should not create a task when value contains letter", async () => {
    const task = {
      name: "Read a book",
      value: "ten",
      unit: "pages",
    };

    const response = await request(server.getApp())
      .post("/task/create")
      .set("authorization", `Bearer ${token}`)
      .send(task);

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it("should not create a task when there is value and there is no unit", async () => {
    const task = {
      name: "Read a book",
      value: 10,
    };

    const response = await request(server.getApp())
      .post("/task/create")
      .set("authorization", `Bearer ${token}`)
      .send(task);

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it("should not create a task when there is unit and there is no value", async () => {
    const task = {
      name: "Read a book",
      unit: "pages",
    };

    const response = await request(server.getApp())
      .post("/task/create")
      .set("authorization", `Bearer ${token}`)
      .send(task);

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });
});
