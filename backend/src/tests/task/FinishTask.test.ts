import request from "supertest";
import { Server } from "../../Server";
import { cleanDatabase } from "../Utils";
import { StatusCodes } from "http-status-codes";

let server: Server;
let tokenUserOne = "";
const userOne = {
  name: "user one",
  username: "first",
  password: "password",
};

let tokenUserTwo = "";
const userTwo = {
  name: "user two",
  username: "second",
  password: "password",
};

beforeAll(() => {
  server = new Server();
});

beforeEach(async () => {
  await cleanDatabase();
  await request(server.getApp()).post("/user/create").send(userOne);

  let loginResponse = await request(server.getApp()).post("/user/login").send({
    username: userOne.username,
    password: userOne.password,
  });
  tokenUserOne = loginResponse.body.token;

  await request(server.getApp()).post("/user/create").send(userTwo);

  loginResponse = await request(server.getApp()).post("/user/login").send({
    username: userTwo.username,
    password: userTwo.password,
  });
  tokenUserTwo = loginResponse.body.token;
});

afterAll(async () => {
  await cleanDatabase();
});

describe("Finish tasks endpoint", () => {
  it("should finish a task", async () => {
    const date = new Date();
    const task = {
      name: "Go to the gym",
    };

    const responseTaskCreated = await request(server.getApp())
      .post("/task/create")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .send(task);

    const response = await request(server.getApp())
      .post("/task/finish")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .send({
        date,
        taskId: responseTaskCreated.body.id,
      });

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.taskId).toBe(responseTaskCreated.body.id);
    expect(response.body.value).toBeNull();
    expect(response.body.created_at).toBe(date.toISOString());
  });

  it("should finish a task with value", async () => {
    const date = new Date();
    const task = {
      name: "Read a book",
      value: 10,
      unit: "pages",
    };

    const responseTaskCreated = await request(server.getApp())
      .post("/task/create")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .send(task);

    const response = await request(server.getApp())
      .post("/task/finish")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .send({
        date,
        taskId: responseTaskCreated.body.id,
        value: 10,
      });

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.taskId).toBe(responseTaskCreated.body.id);
    expect(response.body.value).toBe(task.value);
    expect(response.body.created_at).toBe(date.toISOString());
  });

  it("should not allow a user to complete another user's task", async () => {
    const date = new Date();
    const task = {
      name: "Read a book",
      value: 10,
      unit: "pages",
    };

    const responseTaskCreated = await request(server.getApp())
      .post("/task/create")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .send(task);

    const response = await request(server.getApp())
      .post("/task/finish")
      .set("authorization", `Bearer ${tokenUserTwo}`)
      .send({
        date,
        taskId: responseTaskCreated.body.id,
        value: 10,
      });

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });

  it("should not finish a task if its id is invalid", async () => {
    const date = new Date();
    const task = {
      name: "Read a book",
    };

    await request(server.getApp())
      .post("/task/create")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .send(task);

    const response = await request(server.getApp())
      .post("/task/finish")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .send({
        date,
        taskId: "invalidIdTask",
      });

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it("should not finish a task if it requires a value and it was not provided.", async () => {
    const date = new Date();
    const task = {
      name: "Read a book",
      value: 10,
      unit: "pages",
    };

    const responseTaskCreated = await request(server.getApp())
      .post("/task/create")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .send(task);

    const response = await request(server.getApp())
      .post("/task/finish")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .send({
        date,
        taskId: responseTaskCreated.body.id,
      });

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it("should not finish a task when value contains letter", async () => {
    const date = new Date();
    const task = {
      name: "Read a book",
      value: 10,
      unit: "pages",
    };

    const responseTaskCreated = await request(server.getApp())
      .post("/task/create")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .send(task);

    const response = await request(server.getApp())
      .post("/task/finish")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .send({
        date,
        taskId: responseTaskCreated.body.id,
        value: "ten",
      });

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it("should not finish a task when there is no taskId", async () => {
    const date = new Date();
    const task = {
      name: "Go to the park",
    };

    await request(server.getApp())
      .post("/task/create")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .send(task);

    const response = await request(server.getApp())
      .post("/task/finish")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .send({
        date,
      });

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it("should not finish a task when there is no date", async () => {
    const task = {
      name: "Go to the gym",
    };

    const responseTaskCreated = await request(server.getApp())
      .post("/task/create")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .send(task);

    const response = await request(server.getApp())
      .post("/task/finish")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .send({
        taskId: responseTaskCreated.body.id,
      });

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });
});
