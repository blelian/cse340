const request = require("supertest");
const app = require("../server");

jest.setTimeout(10000); // Increase timeout in case of slow tests

describe("POST /account/login", () => {
  test("should redirect admin to /admin/dashboard", async () => {
    const response = await request(app)
      .post("/account/login")
      .send({ email: "admin@example.com", password: "AdminPass123!" });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe("/admin/dashboard");
  });

  test("should redirect regular user to /", async () => {
    const response = await request(app)
      .post("/account/login")
      .send({ email: "user@example.com", password: "UserPass123!" });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe("/");
  });

  test("should show errors on invalid login data", async () => {
    const response = await request(app)
      .post("/account/login")
      .send({ email: "bademail", password: "123" });

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("Valid email required.");
  });
});
