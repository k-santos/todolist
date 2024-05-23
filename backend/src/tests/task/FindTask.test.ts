import request from "supertest";
import { Server } from "../../Server";
import { cleanDatabase } from "../Utils";
import { prismaClient } from "../../lib/Client";
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

describe("Find tasks endpoint", () => {
  it("should find task not yet completed", async () => {
    const task = {
      name: "Go to the gym",
    };

    const responseTaskCreated = await request(server.getApp())
      .post("/task/create")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .send(task);

    let response = await request(server.getApp())
      .get("/task/find")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .query({
        date: new Date().toISOString(),
      });

    expect(response.body).toHaveLength(1);
    expect(response.body).toEqual([
      {
        name: task.name,
        complement: undefined,
        id: responseTaskCreated.body.id,
        idHistoryToday: undefined,
      },
    ]);
  });

  it("should find task completed", async () => {
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
        taskId: responseTaskCreated.body.id,
        value: undefined,
        date: new Date(),
      });

    const history = await prismaClient.taskHistory.findMany({
      where: {
        taskId: responseTaskCreated.body.id,
      },
    });

    expect(history).toHaveLength(1);

    let response = await request(server.getApp())
      .get("/task/find")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .query({
        date: new Date().toISOString(),
      });

    expect(response.body).toHaveLength(1);
    expect(response.body).toEqual([
      {
        name: task.name,
        complement: undefined,
        id: responseTaskCreated.body.id,
        idHistoryToday: history[0].id,
      },
    ]);
  });

  it("should just find their own tasks", async () => {
    const firstTaskUserOne = {
      name: "Go to the gym",
      value: 50,
      unit: "min",
    };

    const secondTaskUserOne = {
      name: "Go to the market",
    };

    const firstTaskUserOneCreated = await request(server.getApp())
      .post("/task/create")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .send(firstTaskUserOne);

    const secondTaskUserOneCreated = await request(server.getApp())
      .post("/task/create")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .send(secondTaskUserOne);

    const firstTaskUserTwo = {
      name: "Go to the park",
    };

    const firstTaskUserTwoCreated = await request(server.getApp())
      .post("/task/create")
      .set("authorization", `Bearer ${tokenUserTwo}`)
      .send(firstTaskUserTwo);

    let response = await request(server.getApp())
      .get("/task/find")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .query({
        date: new Date().toISOString(),
      });
    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual(
      expect.arrayContaining([
        {
          name: firstTaskUserOne.name,
          complement: `${firstTaskUserOne.value} ${firstTaskUserOne.unit}`,
          id: firstTaskUserOneCreated.body.id,
          idHistoryToday: undefined,
        },
        {
          name: secondTaskUserOne.name,
          id: secondTaskUserOneCreated.body.id,
          idHistoryToday: undefined,
        },
      ])
    );

    response = await request(server.getApp())
      .get("/task/find")
      .set("authorization", `Bearer ${tokenUserTwo}`)
      .query({
        date: new Date().toISOString(),
      });
    expect(response.body).toHaveLength(1);
    expect(response.body).toEqual(
      expect.arrayContaining([
        {
          name: firstTaskUserTwo.name,
          id: firstTaskUserTwoCreated.body.id,
          idHistoryToday: undefined,
        },
      ])
    );
  });

  it("should not find task when date is not provided", async () => {
    const task = {
      name: "Go to the gym",
    };

    const responseTaskCreated = await request(server.getApp())
      .post("/task/create")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .send(task);

    let response = await request(server.getApp())
      .get("/task/find")
      .set("authorization", `Bearer ${tokenUserOne}`)
      .query({
        date: undefined,
      });

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });
});
