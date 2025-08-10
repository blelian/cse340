// tests/adminRoutes.test.js
const express = require("express");

describe("Admin Routes module", () => {
  let adminRoutes;

  beforeAll(() => {
    // Attempt to import the routes file
    adminRoutes = require("../routes/admin");
  });

  test("should export an Express Router instance", () => {
    // Express routers are functions with `use`, `get`, `post` methods
    expect(adminRoutes).toBeDefined();
    expect(typeof adminRoutes).toBe("function");
    expect(typeof adminRoutes.use).toBe("function");
    expect(typeof adminRoutes.get).toBe("function");
  });

  test("should not throw error when requiring", () => {
    // If require fails, beforeAll would error, so this should pass
    expect(() => require("../routes/admin")).not.toThrow();
  });
});
