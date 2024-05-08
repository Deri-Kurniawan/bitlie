import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import app from "../app";
import { HttpStatusCode } from "../lib/utils";

describe("Test the root path", () => {
  test("It should response the GET method", (done: any) => {
    request(app)
      .get("/")
      .then((response: any) => {
        expect(response.statusCode).toBe(HttpStatusCode.OK);
        done();
      });
  });
});
