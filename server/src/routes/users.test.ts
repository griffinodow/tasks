import { app } from "../utils/frameworks/express";
import { pool } from "../utils/frameworks/postgresql";
import request from "supertest";

describe("users", () => {
  test("returns status success with valid user that can be authorized", async () => {
    // Get a new user
    const post: request.Response = await request(app).post("/users");
    const id = post.body.data.user.id;
    expect(post.statusCode).toEqual(200);
    expect(post.body.status).toEqual("success");
    expect(post.body.data.user).toHaveProperty("id");

    // Revalidate user
    const get = await request(app).get(`/users/${id}`);
    expect(get.statusCode).toEqual(200);
    expect(post.body.status).toEqual("success");
    expect(get.body.data.user.id).toEqual(id);

    // Cleanup test
    await request(app).delete(`/users/${id}`);
  });

  test("returns status fail when getting user with invalid id", async () => {
    // Too short
    const getTooShort: request.Response = await request(app).get(`/users/ABC`);
    expect(getTooShort.statusCode).toEqual(400);
    expect(getTooShort.body.status).toEqual("fail");
    expect(getTooShort.body.messages).toEqual(["ID is not a valid format"]);

    // Too long
    const getTooLong: request.Response = await request(app).get(
      `/users/ABC12345`
    );
    expect(getTooLong.statusCode).toEqual(400);
    expect(getTooLong.body.status).toEqual("fail");
    expect(getTooLong.body.messages).toEqual(["ID is not a valid format"]);

    // Not alphanumeric
    const getNotAlphaNum: request.Response = await request(app).get(
      "/users/AB$123"
    );
    expect(getNotAlphaNum.statusCode).toEqual(400);
    expect(getNotAlphaNum.body.status).toEqual("fail");
    expect(getNotAlphaNum.body.messages).toEqual(["ID is not a valid format"]);
  });

  test("returns status fail when getting user that does not exist with valid id", async () => {
    const get: request.Response = await request(app).get(`/users/ABC123`);
    expect(get.statusCode).toEqual(400);
    expect(get.body.status).toEqual("fail");
    expect(get.body.messages).toEqual(["Account does not exist with ID"]);
  });

  test("returns status success when deleting existing user", async () => {
    // Get a new user
    const post: request.Response = await request(app).post("/users");
    const id = post.body.data.user.id;
    const del: request.Response = await request(app).delete(`/users/${id}`);
    expect(del.statusCode).toEqual(200);
    expect(del.body.status).toEqual("success");
    expect(del.body.data).toEqual(null);
  });

  test("returns status fail when deleting with invalid id", async () => {
    // Too long
    const delTooShort: request.Response = await request(app).delete(
      `/users/abc1235`
    );
    expect(delTooShort.statusCode).toEqual(400);
    expect(delTooShort.body.status).toEqual("fail");
    expect(delTooShort.body.messages).toEqual(["ID is not a valid format"]);

    // Too long
    const delTooLong: request.Response = await request(app).delete(
      `/users/abc`
    );
    expect(delTooLong.statusCode).toEqual(400);
    expect(delTooLong.body.status).toEqual("fail");
    expect(delTooLong.body.messages).toEqual(["ID is not a valid format"]);

    // Not alphanumeric
    const delNotAlphaNum: request.Response = await request(app).delete(
      "/users/abc$23"
    );
    expect(delNotAlphaNum.statusCode).toEqual(400);
    expect(delNotAlphaNum.body.status).toEqual("fail");
    expect(delNotAlphaNum.body.messages).toEqual(["ID is not a valid format"]);
  });
});

afterAll(() => {
  pool.end();
});
