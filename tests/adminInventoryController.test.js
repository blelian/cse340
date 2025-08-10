const adminInvController = require("../controllers/adminInventoryController");
const invModel = require("../models/inventoryModel");
const utilities = require("../utilities");

jest.mock("../models/inventoryModel");
jest.mock("../utilities");

describe("Admin Inventory Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { id: "1" },
      body: {
        inv_make: "MakeX",
        inv_model: "ModelY",
        inv_year: "2024",
        inv_description: "Desc",
        inv_image: "/img/x.jpg",
        inv_thumbnail: "/img/x-thumb.jpg",
        inv_price: "30000",
        inv_miles: "200",
        inv_color: "Blue",
        classification_id: "1",
      },
    };

    res = {
      render: jest.fn(),
      redirect: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(), // <-- added to fix 404 test for showEditForm
    };

    next = jest.fn();
  });

  describe("listInventory", () => {
    test("renders inventory list view with data", async () => {
      invModel.getAllInventory.mockResolvedValue([
        { inv_make: "Make1", inv_model: "Model1", inv_price: 1000, classification_name: "SUV" },
      ]);
      utilities.getNav.mockResolvedValue(["nav"]);

      await adminInvController.listInventory(req, res, next);

      expect(invModel.getAllInventory).toHaveBeenCalled();
      expect(utilities.getNav).toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(
        "admin/inventory", // FIXED here from 'admin/inventory/list'
        expect.objectContaining({
          title: "Inventory Management",
          nav: ["nav"],
          inventory: expect.any(Array),
        })
      );
    });

    test("calls next on error", async () => {
      const error = new Error("fail");
      invModel.getAllInventory.mockRejectedValue(error);
      await adminInvController.listInventory(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("showAddForm", () => {
    test("renders add inventory form", async () => {
      utilities.getNav.mockResolvedValue(["nav"]);
      invModel.getClassifications.mockResolvedValue([{ classification_name: "SUV", classification_id: 1 }]);

      await adminInvController.showAddForm(req, res, next);

      expect(utilities.getNav).toHaveBeenCalled();
      expect(invModel.getClassifications).toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(
        "admin/inventory/add",
        expect.objectContaining({
          title: "Add Inventory Item",
          nav: ["nav"],
          classifications: expect.any(Array),
          errors: null,
        })
      );
    });

    test("calls next on error", async () => {
      const error = new Error("fail");
      invModel.getClassifications.mockRejectedValue(error);
      await adminInvController.showAddForm(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("addInventory", () => {
    test("redirects after successful add", async () => {
      invModel.addInventory.mockResolvedValue({});

      await adminInvController.addInventory(req, res, next);

      // FIXED here to expect positional args, not one object
      expect(invModel.addInventory).toHaveBeenCalledWith(
        "MakeX",
        "ModelY",
        2024,
        "Desc",
        "/img/x.jpg",
        "/img/x-thumb.jpg",
        30000,
        200,
        "Blue",
        1
      );
      expect(res.redirect).toHaveBeenCalledWith("/admin/inventory");
    });

    test("renders form with errors if required fields missing", async () => {
      req.body.inv_make = ""; // required field missing
      utilities.getNav.mockResolvedValue(["nav"]);
      invModel.getClassifications.mockResolvedValue([{ classification_name: "SUV", classification_id: 1 }]);

      await adminInvController.addInventory(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.render).toHaveBeenCalledWith(
        "admin/inventory/add",
        expect.objectContaining({
          errors: expect.any(Array),
          classifications: expect.any(Array),
        })
      );
    });

    test("calls next on model error", async () => {
      const error = new Error("fail");
      invModel.addInventory.mockRejectedValue(error);
      await adminInvController.addInventory(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("showEditForm", () => {
    test("renders edit form with inventory item", async () => {
      invModel.getInventoryById.mockResolvedValue({ inv_id: 1, inv_make: "MakeX" });
      utilities.getNav.mockResolvedValue(["nav"]);
      invModel.getClassifications.mockResolvedValue([{ classification_name: "SUV", classification_id: 1 }]);

      await adminInvController.showEditForm(req, res, next);

      expect(invModel.getInventoryById).toHaveBeenCalledWith("1");
      expect(res.render).toHaveBeenCalledWith(
        "admin/inventory/edit",
        expect.objectContaining({
          title: "Edit Inventory Item",
          nav: ["nav"],
          inventoryItem: expect.objectContaining({ inv_id: 1 }),
          classifications: expect.any(Array),
          errors: null,
        })
      );
    });

    test("sends 404 if inventory item not found", async () => {
      invModel.getInventoryById.mockResolvedValue(undefined);
      await adminInvController.showEditForm(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Inventory item not found");
      expect(next).not.toHaveBeenCalled();
    });

    test("calls next on error", async () => {
      const error = new Error("fail");
      invModel.getInventoryById.mockRejectedValue(error);
      await adminInvController.showEditForm(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("updateInventory", () => {
    test("updates inventory and redirects", async () => {
      invModel.updateInventory.mockResolvedValue({ inv_id: 1 });

      await adminInvController.updateInventory(req, res, next);

      expect(invModel.updateInventory).toHaveBeenCalledWith(
        "MakeX",
        "ModelY",
        2024,
        "Desc",
        "/img/x.jpg",
        "/img/x-thumb.jpg",
        30000,
        200,
        "Blue",
        1,
        "1"
      );
      expect(res.redirect).toHaveBeenCalledWith("/admin/inventory");
    });

    test("calls next on error", async () => {
      const error = new Error("fail");
      invModel.updateInventory.mockRejectedValue(error);
      await adminInvController.updateInventory(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("deleteInventory", () => {
    test("deletes inventory and redirects", async () => {
      invModel.deleteInventory.mockResolvedValue({ inv_id: 1 });

      await adminInvController.deleteInventory(req, res, next);

      expect(invModel.deleteInventory).toHaveBeenCalledWith("1");
      expect(res.redirect).toHaveBeenCalledWith("/admin/inventory");
    });

    test("calls next on error", async () => {
      const error = new Error("fail");
      invModel.deleteInventory.mockRejectedValue(error);
      await adminInvController.deleteInventory(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
