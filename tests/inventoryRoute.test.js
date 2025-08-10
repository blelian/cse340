const request = require("supertest");
const app = require("../server");

describe("Inventory Routes", () => {
  // Assuming classificationId 1 exists in your test DB
  const validClassificationId = 1;
  const invalidClassificationId = 99999; // unlikely to exist

  test("GET /inventory/type/:classificationId returns 200 and renders page", async () => {
    const response = await request(app).get(`/inventory/type/${validClassificationId}`);
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("vehicles"); // assumes page title includes "vehicles"
  });

  test("GET /inventory/type/:classificationId with invalid ID returns 200 but with 'No vehicles found'", async () => {
    const response = await request(app).get(`/inventory/type/${invalidClassificationId}`);
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("No vehicles found");
  });

  test("GET /inventory/getInventory/:classification_id returns JSON array", async () => {
    const response = await request(app).get(`/inventory/getInventory/${validClassificationId}`);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /inventory/getInventory/:classification_id with invalid ID returns empty JSON array", async () => {
    const response = await request(app).get(`/inventory/getInventory/${invalidClassificationId}`);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });
});
