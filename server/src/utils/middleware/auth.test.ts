import { app } from "../frameworks/express";
import { pool } from "../frameworks/postgresql";
import request from "supertest";

describe("auth", () => {
  test("returns status fail when accessing protecting route without token", async () => {
    const get: request.Response = await request(app).get(`/lists`);
    expect(get.statusCode).toEqual(400);
    expect(get.body.status).toEqual("fail");
    expect(get.body.messages).toEqual(["Authorization required"]);
  });

  test("returns status fail when accessing protected route with token that doesn't exist", async () => {
    const get: request.Response = await request(app)
      .get(`/lists`)
      .set({ Authorization: `Bearer ABC123`, Accept: "application/json" });
    expect(get.statusCode).toEqual(400);
    expect(get.body.status).toEqual("fail");
    expect(get.body.messages).toEqual(["Authorization failed"]);
  });

  test("returns status fail when accessing protected route with invalid token", async () => {
    const get: request.Response = await request(app)
      .get(`/lists`)
      .set({ Authorization: `Bearer ABC12#$`, Accept: "application/json" });
    expect(get.statusCode).toEqual(400);
    expect(get.body.status).toEqual("fail");
    expect(get.body.messages).toEqual(["Invalid ID"]);
  });
});

afterAll(() => {
  pool.end();
});
