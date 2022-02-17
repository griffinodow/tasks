import { app } from "../utils/frameworks/express";
import { pool } from "../utils/frameworks/postgresql";
import request from "supertest";

describe("lists", () => {
  test("returns status success and list when posting new list", async () => {
    // Test user
    const postTestUser: request.Response = await request(app).post("/users");
    const id = postTestUser.body.data.user.id;

    // Create list
    const testList1 = {
      uuid: "ae4673a1-58ea-40b7-ba07-ceced404472d",
      name: "Test List",
    };
    const postNewList: request.Response = await request(app)
      .post("/lists")
      .send(testList1)
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });
    expect(postNewList.statusCode).toEqual(200);
    expect(postNewList.body.status).toEqual("success");
    expect(postNewList.body.data.list).toEqual(testList1);

    // Cleanup test user
    await request(app).delete(`/users/${id}`);
  });

  test("returns status success when getting lists", async () => {
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

    const getLists: request.Response = await request(app)
      .get("/lists")
      .set({ Authorization: `Bearer ${id}` });

    expect(getLists.statusCode).toEqual(200);
    expect(getLists.body.status).toEqual("success");
    expect(getLists.body.data.lists).toEqual([testList1]);

    // Cleanup test user
    await request(app).delete(`/users/${id}`);
  });

  test("returns status success when putting list", async () => {
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

    const putList: request.Response = await request(app)
      .put(`/lists/${testList1.uuid}`)
      .send({ name: "Test List Updated" })
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });
    expect(putList.statusCode).toEqual(200);
    expect(putList.body.status).toEqual("success");
    expect(putList.body.data.list).toEqual({
      uuid: testList1.uuid,
      name: "Test List Updated",
    });

    // Cleanup test user
    await request(app).delete(`/users/${id}`);
  });

  test("returns status success when deleting a list that exists", async () => {
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

    const del: request.Response = await request(app)
      .delete(`/lists/${testList1.uuid}`)
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });
    expect(del.statusCode).toEqual(200);
    expect(del.body.status).toEqual("success");
    expect(del.body.data).toEqual(null);

    // Cleanup test user
    await request(app).delete(`/users/${id}`);
  });

  test("returns status fail when posting a list without an uuid", async () => {
    // Test user
    const postTestUser: request.Response = await request(app).post("/users");
    const id = postTestUser.body.data.user.id;

    // Create list
    const post: request.Response = await request(app)
      .post("/lists")
      .send({
        name: "Test List",
      })
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });
    expect(post.statusCode).toEqual(400);
    expect(post.body.status).toEqual("fail");
    expect(post.body.messages).toEqual([
      "Uuid must be provided",
      "Uuid is not in valid v4 format",
    ]);

    // Cleanup test user
    await request(app).delete(`/users/${id}`);
  });

  test("returns status fail when posting a list without a valid uuid", async () => {
    // Test user
    const postTestUser: request.Response = await request(app).post("/users");
    const id = postTestUser.body.data.user.id;

    // Create list
    const post: request.Response = await request(app)
      .post("/lists")
      .send({
        uuid: "lsakfjklsajflkasjkldsjalkfj",
        name: "Test List",
      })
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });
    expect(post.statusCode).toEqual(400);
    expect(post.body.status).toEqual("fail");
    expect(post.body.messages).toEqual(["Uuid is not in valid v4 format"]);

    // Cleanup test user
    await request(app).delete(`/users/${id}`);
  });

  test("returns status fail when posting a list without a name", async () => {
    // Test user
    const postTestUser: request.Response = await request(app).post("/users");
    const id = postTestUser.body.data.user.id;

    // Create list
    const post: request.Response = await request(app)
      .post("/lists")
      .send({
        uuid: "ae4673a1-58ea-40b7-ba07-ceced404472d",
      })
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });
    expect(post.statusCode).toEqual(400);
    expect(post.body.status).toEqual("fail");
    expect(post.body.messages).toEqual(["Name must be provided"]);

    // Cleanup test user
    await request(app).delete(`/users/${id}`);
  });

  test("returns status fail when updating a list without a name", async () => {
    // Test user
    const postTestUser: request.Response = await request(app).post("/users");
    const id = postTestUser.body.data.user.id;

    // Create list
    const list = {
      uuid: "ae4673a1-58ea-40b7-ba07-ceced404472d",
      name: "Test List",
    };
    await request(app)
      .post("/lists")
      .send(list)
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });

    // Update list
    const put: request.Response = await request(app)
      .put(`/lists/${list.uuid}`)
      .send({})
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });
    expect(put.statusCode).toEqual(400);
    expect(put.body.status).toEqual("fail");
    expect(put.body.messages).toEqual(["Name must be provided"]);

    // Cleanup test user
    await request(app).delete(`/users/${id}`);
  });

  test("returns status fail when updating a list with an invalid uuid", async () => {
    // Test user
    const postTestUser: request.Response = await request(app).post("/users");
    const id = postTestUser.body.data.user.id;

    // Update list
    const put: request.Response = await request(app)
      .put("/lists/not-real-uuid")
      .send({
        name: "New name",
      })
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });
    expect(put.statusCode).toEqual(400);
    expect(put.body.status).toEqual("fail");
    expect(put.body.messages).toEqual(["Uuid is not in valid v4 format"]);

    // Cleanup test user
    await request(app).delete(`/users/${id}`);
  });

  test("returns status fail when updating a list that does not exist", async () => {
    // Test user
    const postTestUser: request.Response = await request(app).post("/users");
    const id = postTestUser.body.data.user.id;

    // Update list
    const put: request.Response = await request(app)
      .put("/lists/842958e7-c483-4b80-af45-a1667c57194e")
      .send({
        name: "New name",
      })
      .set({ Authorization: `Bearer ${id}`, Accept: "application/json" });
    expect(put.statusCode).toEqual(400);
    expect(put.body.status).toEqual("fail");
    expect(put.body.messages).toEqual(["List does not exist"]);

    // Cleanup test user
    await request(app).delete(`/users/${id}`);
  });
});

afterAll(() => {
  pool.end();
});
