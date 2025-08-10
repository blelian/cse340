const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../server");

const JWT_SECRET = process.env.JWT_SECRET || "testsecret";

function generateToken(role) {
  return jwt.sign({ account_id: 1, email: "admin@test.com", role }, JWT_SECRET, { expiresIn: "1h" });
}

describe("Admin Routes", () => {
  test("Redirect unauthenticated user to login", async () => {
    const response = await request(app).get("/admin/dashboard");
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toMatch(/\/account\/login/);
  });

  test("Deny access to authenticated non-admin user", async () => {
    const token = generateToken("user");
    const response = await request(app)
      .get("/admin/dashboard")
      .set("Cookie", [`jwt=${token}`]);
    expect(response.statusCode).toBe(403);
    expect(response.text).toContain("Access denied. Admins only.");
  });

  test("Allow access to authenticated admin user", async () => {
    const token = generateToken("admin");
    const response = await request(app)
      .get("/admin/dashboard")
      .set("Cookie", [`jwt=${token}`]);
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("Admin Dashboard");
  });
});
