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

describe("Undo tasks endpoint", () => {
  it("should undo a task", async () => {
    const date = new Date();
    const task = {
      name: "Go to the gym",
    };

    const responseTaskCreated = await request(server.getApp())
      .post("/task/create")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .send(task);

    const responseTaskFinished = await request(server.getApp())
      .post("/task/finish")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .send({
        date,
        taskId: responseTaskCreated.body.id,
      });

    const responseUndoTask = await request(server.getApp())
      .post("/task/undo")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .send({
        date,
        historyId: responseTaskFinished.body.id,
      });

    expect(responseUndoTask.status).toBe(StatusCodes.OK);
  });

  it("should not be possible for a user to undo another user's task", async () => {
    const date = new Date();
    const task = {
      name: "Go to the gym",
    };

    const responseTaskCreated = await request(server.getApp())
      .post("/task/create")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .send(task);

    const responseTaskFinished = await request(server.getApp())
      .post("/task/finish")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .send({
        date,
        taskId: responseTaskCreated.body.id,
      });

    const responseUndoTask = await request(server.getApp())
      .post("/task/undo")
      .set("authorization", `Bearer ${tokenUserTwo}`)
      .send({
        date,
        historyId: responseTaskFinished.body.id,
      });

    expect(responseUndoTask.status).toBe(StatusCodes.UNAUTHORIZED);
  });

  it("should not be possible to undo a task without historyId", async () => {
    const date = new Date();
    const task = {
      name: "Go to the gym",
    };

    const responseTaskCreated = await request(server.getApp())
      .post("/task/create")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .send(task);

    await request(server.getApp())
      .post("/task/finish")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .send({
        date,
        taskId: responseTaskCreated.body.id,
      });

    const responseUndoTask = await request(server.getApp())
      .post("/task/undo")
      .set("authorization", `Bearer ${tokenUserTwo}`);

    expect(responseUndoTask.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it("should not be possible to undo a task with invalid historyId", async () => {
    const date = new Date();
    const task = {
      name: "Go to the gym",
    };

    const responseTaskCreated = await request(server.getApp())
      .post("/task/create")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .send(task);

    const responseTaskFinished = await request(server.getApp())
      .post("/task/finish")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .send({
        date,
        taskId: responseTaskCreated.body.id,
      });

    const responseUndoTask = await request(server.getApp())
      .post("/task/undo")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .send({
        date,
        historyId: "invalidHistoryId",
      });

    expect(responseUndoTask.status).toBe(StatusCodes.BAD_REQUEST);
  });
});
