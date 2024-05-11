import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import app from "../../app";
import { HttpStatusCode } from "../../lib/utils";

describe("Test the /api/app path", () => {
  test(`It should response the GET method with status ${HttpStatusCode.UNAUTHORIZED}`, (done: any) => {
    request(app)
      .get("/api/app")
      .then((res: any) => {
        expect(res.statusCode).toBe(HttpStatusCode.UNAUTHORIZED);
        expect(res.body).toBeDefined();
        expect(res.body).toHaveProperty("code");
        expect(res.body).toHaveProperty("status");
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("data");
        expect(res.body).toHaveProperty("errors");
        done();
      });
  });

  test(`It should response the GET method with status ${HttpStatusCode.OK}`, (done: any) => {
    request(app)
      .get("/api/app")
      .set("Authorization", `Bearer ${process.env.SEED_SECRET_TOKEN}`)
      .then((res: any) => {
        expect(res.statusCode).toBe(HttpStatusCode.OK);
        expect(res.body).toBeDefined();
        expect(res.body).toHaveProperty("code");
        expect(res.body).toHaveProperty("status");
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("data");
        expect(res.body).toHaveProperty("errors");
        done();
      });
  });
});
