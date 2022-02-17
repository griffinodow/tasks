import { app } from "../utils/frameworks/express";
import { pool } from "../utils/frameworks/postgresql";
import request from "supertest";

describe("tasks", () => {
  test("returns status success and task when posting new task", async () => {
    // Test user
    const postTestUser: request.Response = await request(app).post("/users");
    const id = postTestUser.body.data.user.id;

    // Test list
    const testList1 = {
      uuid: "ae4673a1-58ea-40b7-ba07-ceced404472d",
      name: "Test List",
    };
    await request(app)
      .post("/lists")
      .send(testList1)
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });

    // Test task
    const testTask1 = {
      uuid: "c8075eea-2636-49fb-bb3e-3b0a624d0beb",
      name: "Test Task",
      complete: false,
    };
    const postNewTask: request.Response = await request(app)
      .post(`/lists/${testList1.uuid}/tasks`)
      .send(testTask1)
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });

    expect(postNewTask.statusCode).toEqual(200);
    expect(postNewTask.body.status).toEqual("success");
    expect(postNewTask.body.data.task).toEqual(testTask1);

    // Cleanup test user
    await request(app).delete(`/users/${id}`);
  });

  test("returns status success when getting tasks", async () => {
    // Test user
    const postTestUser: request.Response = await request(app).post("/users");
    const id = postTestUser.body.data.user.id;

    // Create list
    const testList1 = {
      uuid: "ae4673a1-58ea-40b7-ba07-ceced404472d",
      name: "Test List",
    };
    await request(app)
      .post("/lists")
      .send(testList1)
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });

    // Test task
    const testTask1 = {
      uuid: "c8075eea-2636-49fb-bb3e-3b0a624d0beb",
      name: "Test Task",
      complete: false,
    };
    await request(app)
      .post(`/lists/${testList1.uuid}/tasks`)
      .send(testTask1)
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });

    const getTasks: request.Response = await request(app)
      .get(`/lists/${testList1.uuid}/tasks`)
      .set({ Authorization: `Bearer ${id}` });

    expect(getTasks.statusCode).toEqual(200);
    expect(getTasks.body.status).toEqual("success");
    expect(getTasks.body.data.tasks).toEqual([testTask1]);

    // Cleanup test user
    await request(app).delete(`/users/${id}`);
  });

  test("returns status success when updating a task", async () => {
    // Test user
    const postTestUser: request.Response = await request(app).post("/users");
    const id = postTestUser.body.data.user.id;

    // Create list
    const testList1 = {
      uuid: "ae4673a1-58ea-40b7-ba07-ceced404472d",
      name: "Test List",
    };
    await request(app)
      .post("/lists")
      .send(testList1)
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });

    // Test task
    const testTask1 = {
      uuid: "c8075eea-2636-49fb-bb3e-3b0a624d0beb",
      name: "Test Task",
      complete: false,
    };
    await request(app)
      .post(`/lists/${testList1.uuid}/tasks`)
      .send(testTask1)
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });

    const putTask: request.Response = await request(app)
      .put(`/lists/${testList1.uuid}/tasks/${testTask1.uuid}`)
      .send({
        name: "Updated Task",
        complete: true,
      })
      .set({ Authorization: `Bearer ${id}` });

    expect(putTask.statusCode).toEqual(200);
    expect(putTask.body.status).toEqual("success");
    expect(putTask.body.data.task).toEqual({
      uuid: testTask1.uuid,
      name: "Updated Task",
      complete: true,
    });

    // Cleanup test user
    await request(app).delete(`/users/${id}`);
  });

  test("returns status success when deleting a task", async () => {
    // Test user
    const postTestUser: request.Response = await request(app).post("/users");
    const id = postTestUser.body.data.user.id;

    // Create list
    const testList1 = {
      uuid: "ae4673a1-58ea-40b7-ba07-ceced404472d",
      name: "Test List",
    };
    await request(app)
      .post("/lists")
      .send(testList1)
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });

    // Test task
    const testTask1 = {
      uuid: "c8075eea-2636-49fb-bb3e-3b0a624d0beb",
      name: "Test Task",
      complete: false,
    };
    await request(app)
      .post(`/lists/${testList1.uuid}/tasks`)
      .send(testTask1)
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });

    const delTask: request.Response = await request(app)
      .delete(`/lists/${testList1.uuid}/tasks/${testTask1.uuid}`)
      .set({ Authorization: `Bearer ${id}` });

    expect(delTask.statusCode).toEqual(200);
    expect(delTask.body.status).toEqual("success");
    expect(delTask.body.data).toEqual(null);

    // Cleanup test user
    await request(app).delete(`/users/${id}`);
  });

  test("returns status fail when posting task without a uuid", async () => {
    // Test user
    const postTestUser: request.Response = await request(app).post("/users");
    const id = postTestUser.body.data.user.id;

    // Test list
    const testList1 = {
      uuid: "ae4673a1-58ea-40b7-ba07-ceced404472d",
      name: "Test List",
    };
    await request(app)
      .post("/lists")
      .send(testList1)
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });

    // Test task
    const testTask1 = {
      name: "Test Task",
      complete: false,
    };
    const postNewTask: request.Response = await request(app)
      .post(`/lists/${testList1.uuid}/tasks`)
      .send(testTask1)
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });

    expect(postNewTask.statusCode).toEqual(400);
    expect(postNewTask.body.status).toEqual("fail");
    expect(postNewTask.body.messages).toEqual([
      "Uuid must be provided",
      "Uuid is not in valid v4 format",
    ]);

    // Cleanup test user
    await request(app).delete(`/users/${id}`);
  });

  test("returns status fail when posting task without a name", async () => {
    // Test user
    const postTestUser: request.Response = await request(app).post("/users");
    const id = postTestUser.body.data.user.id;

    // Test list
    const testList1 = {
      uuid: "ae4673a1-58ea-40b7-ba07-ceced404472d",
      name: "Test List",
    };
    await request(app)
      .post("/lists")
      .send(testList1)
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });

    // Test task
    const testTask1 = {
      uuid: "c8075eea-2636-49fb-bb3e-3b0a624d0beb",
      complete: false,
    };
    const postNewTask: request.Response = await request(app)
      .post(`/lists/${testList1.uuid}/tasks`)
      .send(testTask1)
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });

    expect(postNewTask.statusCode).toEqual(400);
    expect(postNewTask.body.status).toEqual("fail");
    expect(postNewTask.body.messages).toEqual(["Name must be provided"]);

    // Cleanup test user
    await request(app).delete(`/users/${id}`);
  });

  test("returns status fail when posting task without a complete", async () => {
    // Test user
    const postTestUser: request.Response = await request(app).post("/users");
    const id = postTestUser.body.data.user.id;

    // Test list
    const testList1 = {
      uuid: "ae4673a1-58ea-40b7-ba07-ceced404472d",
      name: "Test List",
    };
    await request(app)
      .post("/lists")
      .send(testList1)
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });

    // Test task
    const testTask1 = {
      uuid: "c8075eea-2636-49fb-bb3e-3b0a624d0beb",
      name: "Test Task",
    };
    const postNewTask: request.Response = await request(app)
      .post(`/lists/${testList1.uuid}/tasks`)
      .send(testTask1)
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });

    expect(postNewTask.statusCode).toEqual(400);
    expect(postNewTask.body.status).toEqual("fail");
    expect(postNewTask.body.messages).toEqual(["Complete must be provided"]);

    // Cleanup test user
    await request(app).delete(`/users/${id}`);
  });

  test("returns status fail when posting task with an invalid uuid", async () => {
    // Test user
    const postTestUser: request.Response = await request(app).post("/users");
    const id = postTestUser.body.data.user.id;

    // Test list
    const testList1 = {
      uuid: "ae4673a1-58ea-40b7-ba07-ceced404472d",
      name: "Test List",
    };
    await request(app)
      .post("/lists")
      .send(testList1)
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });

    // Test task
    const testTask1 = {
      uuid: "here-we-go",
      name: "Test Task",
      complete: false,
    };
    const postNewTask: request.Response = await request(app)
      .post(`/lists/${testList1.uuid}/tasks`)
      .send(testTask1)
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });

    expect(postNewTask.statusCode).toEqual(400);
    expect(postNewTask.body.status).toEqual("fail");
    expect(postNewTask.body.messages).toEqual([
      "Uuid is not in valid v4 format",
    ]);

    // Cleanup test user
    await request(app).delete(`/users/${id}`);
  });

  test("returns status fail when posting task with invalid list uuid", async () => {
    // Test user
    const postTestUser: request.Response = await request(app).post("/users");
    const id = postTestUser.body.data.user.id;

    // Test list
    const testList1 = {
      uuid: "not-valid-uuid",
      name: "Test List",
    };
    await request(app)
      .post("/lists")
      .send(testList1)
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });

    // Test task
    const testTask1 = {
      uuid: "c8075eea-2636-49fb-bb3e-3b0a624d0beb",
      name: "Test Task",
      complete: false,
    };
    const postNewTask: request.Response = await request(app)
      .post(`/lists/${testList1.uuid}/tasks`)
      .send(testTask1)
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });

    expect(postNewTask.statusCode).toEqual(400);
    expect(postNewTask.body.status).toEqual("fail");
    expect(postNewTask.body.messages).toEqual([
      "List uuid is not in valid v4 format",
    ]);

    // Cleanup test user
    await request(app).delete(`/users/${id}`);
  });

  test("returns status fail when getting tasks with invalid list uuid", async () => {
    // Test user
    const postTestUser: request.Response = await request(app).post("/users");
    const id = postTestUser.body.data.user.id;

    // Create list
    const testList1 = {
      uuid: "ae4673a1-58ea-40b7-ba07-ceced404472d",
      name: "Test List",
    };
    await request(app)
      .post("/lists")
      .send(testList1)
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });

    // Test task
    const testTask1 = {
      uuid: "c8075eea-2636-49fb-bb3e-3b0a624d0beb",
      name: "Test Task",
      complete: false,
    };
    await request(app)
      .post(`/lists/${testList1.uuid}/tasks`)
      .send(testTask1)
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });

    const getTasks: request.Response = await request(app)
      .get("/lists/invalid-uuid/tasks")
      .set({ Authorization: `Bearer ${id}` });

    expect(getTasks.statusCode).toEqual(400);
    expect(getTasks.body.status).toEqual("fail");
    expect(getTasks.body.messages).toEqual([
      "List uuid is not in valid v4 format",
    ]);

    // Cleanup test user
    await request(app).delete(`/users/${id}`);
  });

  test("returns status fail when updating task without a name", async () => {
    // Test user
    const postTestUser: request.Response = await request(app).post("/users");
    const id = postTestUser.body.data.user.id;

    // Test list
    const testList1 = {
      uuid: "ae4673a1-58ea-40b7-ba07-ceced404472d",
      name: "Test List",
    };
    await request(app)
      .post("/lists")
      .send(testList1)
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });

    // Test task
    const testTask1 = {
      uuid: "c8075eea-2636-49fb-bb3e-3b0a624d0beb",
      name: "Test Task",
      complete: false,
    };
    await request(app)
      .post(`/lists/${testList1.uuid}/tasks`)
      .send(testTask1)
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });

    // Update task
    const putNewTask: request.Response = await request(app)
      .put(`/lists/${testList1.uuid}/tasks/${testTask1.uuid}`)
      .send({
        complete: false,
      })
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });

    expect(putNewTask.statusCode).toEqual(400);
    expect(putNewTask.body.status).toEqual("fail");
    expect(putNewTask.body.messages).toEqual(["Name must be provided"]);

    // Cleanup test user
    await request(app).delete(`/users/${id}`);
  });

  test("returns status fail when updating task without a complete", async () => {
    // Test user
    const postTestUser: request.Response = await request(app).post("/users");
    const id = postTestUser.body.data.user.id;

    // Test list
    const testList1 = {
      uuid: "ae4673a1-58ea-40b7-ba07-ceced404472d",
      name: "Test List",
    };
    await request(app)
      .post("/lists")
      .send(testList1)
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });

    // Test task
    const testTask1 = {
      uuid: "c8075eea-2636-49fb-bb3e-3b0a624d0beb",
      name: "Test Task",
      complete: false,
    };
    await request(app)
      .post(`/lists/${testList1.uuid}/tasks`)
      .send(testTask1)
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });

    // Update task
    const putNewTask: request.Response = await request(app)
      .put(`/lists/${testList1.uuid}/tasks/${testTask1.uuid}`)
      .send({
        name: "Test Task",
      })
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });

    expect(putNewTask.statusCode).toEqual(400);
    expect(putNewTask.body.status).toEqual("fail");
    expect(putNewTask.body.messages).toEqual(["Complete must be provided"]);

    // Cleanup test user
    await request(app).delete(`/users/${id}`);
  });

  test("returns status fail when updating task with an invalid uuid", async () => {
    // Test user
    const postTestUser: request.Response = await request(app).post("/users");
    const id = postTestUser.body.data.user.id;

    // Test list
    const testList1 = {
      uuid: "ae4673a1-58ea-40b7-ba07-ceced404472d",
      name: "Test List",
    };
    await request(app)
      .post("/lists")
      .send(testList1)
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });

    // Test task
    const testTask1 = {
      uuid: "c8075eea-2636-49fb-bb3e-3b0a624d0beb",
      name: "Test Task",
      complete: false,
    };
    await request(app)
      .post(`/lists/${testList1.uuid}/tasks`)
      .send(testTask1)
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });

    // Update task
    const putNewTask: request.Response = await request(app)
      .put(`/lists/${testList1.uuid}/tasks/not-valid-uuid`)
      .send({
        name: "Test Task",
        complete: false,
      })
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });

    expect(putNewTask.statusCode).toEqual(400);
    expect(putNewTask.body.status).toEqual("fail");
    expect(putNewTask.body.messages).toEqual([
      "Uuid is not in valid v4 format",
    ]);

    // Cleanup test user
    await request(app).delete(`/users/${id}`);
  });
});

afterAll(() => {
  pool.end();
});
