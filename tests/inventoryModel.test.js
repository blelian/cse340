const pool = require("../database");
const inventoryModel = require("../models/inventoryModel");

jest.setTimeout(10000); // Increase timeout to 10 seconds for slow DB ops

describe("Inventory Model Tests", () => {
  let testClassification;
  let testInventory;

  beforeAll(async () => {
    // Clean up any previous test classification to avoid duplicates
    await pool.query('DELETE FROM inventory WHERE inv_make = $1', ['TestMake']);
    await pool.query('DELETE FROM classification WHERE classification_name = $1', ['Test Classification']);

    // Insert a test classification
    testClassification = await inventoryModel.addClassification("Test Classification");

    // Insert a test inventory item
    testInventory = await inventoryModel.addInventory(
      "TestMake",
      "TestModel",
      2025,
      "Test description",
      "/images/test.jpg",
      "/images/test-thumb.jpg",
      25000,
      100,
      "Red",
      testClassification.classification_id
    );
  });

  afterAll(async () => {
    // Delete test inventory
    if (testInventory) {
      await inventoryModel.deleteInventory(testInventory.inv_id);
    }

    // Delete test classification
    if (testClassification) {
      const sql = `DELETE FROM classification WHERE classification_id = $1`;
      await pool.query(sql, [testClassification.classification_id]);
    }

    // Close pool connection if needed
    await pool.end();
  });

  test("getInventoryByClassificationId returns items", async () => {
    const items = await inventoryModel.getInventoryByClassificationId(testClassification.classification_id);
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(0);
    expect(items[0]).toHaveProperty("classification_name", "Test Classification");
  });

  test("getAllInventory returns array", async () => {
    const items = await inventoryModel.getAllInventory();
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(0);
  });

  test("getClassifications returns array", async () => {
    const classifications = await inventoryModel.getClassifications();
    expect(Array.isArray(classifications)).toBe(true);
    expect(classifications.some(c => c.classification_name === "Test Classification")).toBe(true);
  });

  test("addClassification adds classification", async () => {
    const newClass = await inventoryModel.addClassification("Temp Class");
    expect(newClass).toHaveProperty("classification_name", "Temp Class");

    // cleanup
    await pool.query("DELETE FROM classification WHERE classification_id = $1", [newClass.classification_id]);
  });

  test("addInventory adds inventory item", async () => {
    const newInv = await inventoryModel.addInventory(
      "MakeX", "ModelY", 2024, "Desc", "/img/x.jpg", "/img/x-thumb.jpg",
      30000, 200, "Blue", testClassification.classification_id
    );
    expect(newInv).toHaveProperty("inv_make", "MakeX");

    // cleanup
    await inventoryModel.deleteInventory(newInv.inv_id);
  });

  test("getInventoryById returns correct item", async () => {
    const inv = await inventoryModel.getInventoryById(testInventory.inv_id);
    expect(inv).toHaveProperty("inv_id", testInventory.inv_id);
  });

  test("updateInventory updates item", async () => {
    const updated = await inventoryModel.updateInventory(
      "UpdatedMake", "UpdatedModel", 2023, "Updated description", "/img/updated.jpg",
      "/img/updated-thumb.jpg", 35000, 150, "Black", testClassification.classification_id,
      testInventory.inv_id
    );
    expect(updated).toHaveProperty("inv_make", "UpdatedMake");
    expect(updated).toHaveProperty("inv_model", "UpdatedModel");
  });

  test("deleteInventory deletes item", async () => {
    // First add an item to delete
    const toDelete = await inventoryModel.addInventory(
      "DeleteMake", "DeleteModel", 2020, "To delete", "/img/del.jpg", "/img/del-thumb.jpg",
      10000, 50, "White", testClassification.classification_id
    );
    const deleted = await inventoryModel.deleteInventory(toDelete.inv_id);
    expect(deleted).toHaveProperty("inv_id", toDelete.inv_id);

    // Confirm deletion
    const check = await inventoryModel.getInventoryById(toDelete.inv_id);
    expect(check).toBeUndefined();
  });
});
