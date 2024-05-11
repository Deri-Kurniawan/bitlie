import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import app from "../../app";
import { HttpStatusCode } from "../../lib/utils";

describe("Test the /api path", () => {
  test(`It should response the GET method with status ${HttpStatusCode.OK}`, (done: any) => {
    request(app)
      .get("/api")
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

describe("Test the /:alias path", () => {
  test(`It should response the GET method with status ${HttpStatusCode.FOUND}`, (done: any) => {
    request(app)
      .get("/portfolio?nc=1")
      .then((res: any) => {
        const { statusCode } = res;

        expect(statusCode).toBe(HttpStatusCode.FOUND);
        done();
      });
  });
});
