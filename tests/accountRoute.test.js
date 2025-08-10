const request = require("supertest");
const app = require("../server");
const jwt = require("jsonwebtoken");

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

describe("GET /admin/dashboard access control", () => {
  // Helper to create a JWT cookie header
  function createJwtCookie(role) {
    const token = jwt.sign(
      {
        account_id: 1,
        email: role + "@example.com",
        role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return `jwt=${token}`;
  }

  test("should allow admin user access", async () => {
    const cookie = createJwtCookie("admin");

    const response = await request(app)
      .get("/admin/dashboard")
      .set("Cookie", cookie);

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("Welcome to the Admin Dashboard");
  });

  test("should deny access for non-admin user", async () => {
    const cookie = createJwtCookie("user");

    const response = await request(app)
      .get("/admin/dashboard")
      .set("Cookie", cookie);

    expect(response.statusCode).toBe(403);
    expect(response.text).toContain("Access denied. Admins only.");
  });

  test("should redirect unauthenticated user to login", async () => {
    const response = await request(app).get("/admin/dashboard");

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe("/account/login");
  });
});

describe("GET /account/logout", () => {
  test("should clear jwt cookie and redirect to /", async () => {
    const response = await request(app).get("/account/logout");

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe("/");
    expect(response.headers['set-cookie']).toEqual(
      expect.arrayContaining([
        expect.stringContaining('jwt=;'),
      ])
    );
  });
});
