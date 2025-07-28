const invModel = require('../models/inventoryModel');
const utils = require('../utilities');

async function buildById(req, res, next) {
  try {
    const invId = parseInt(req.params.invId);
    const data = await invModel.getVehicleById(invId);
    const nav = await utils.getNav();
    res.render('inventory/detail', {
      title: data.inv_make + " " + data.inv_model,
      nav,
      vehicle: data,
    });
  } catch (error) {
    next(error);
  }
}

async function buildManagement(req, res) {
  const nav = await utils.getNav();
  res.render('inventory/management', {
    title: "Inventory Management",
    nav,
  });
}

async function buildAddClassification(req, res) {
  const nav = await utils.getNav();
  res.render('inventory/add_classification', {
    title: "Add New Classification",
    nav,
  });
}

async function buildAddInventory(req, res, next) {
  try {
    const nav = await utils.getNav();
    const classificationSelect = await utils.getClassificationDropdown();
    res.render('inventory/add_inventory', {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
    });
  } catch (error) {
    next(error);
  }
}

async function addClassification(req, res, next) {
  try {
    const { classification_name } = req.body;
    const exists = await invModel.getClassificationByName(classification_name);

    if (exists) {
      const nav = await utils.getNav();
      return res.status(400).render('inventory/add_classification', {
        title: "Add New Classification",
        nav,
        message: "Classification already exists. Please use a different name."
      });
    }

    const result = await invModel.addClassification(classification_name);
    if (result) {
      res.redirect('/inventory');
    } else {
      throw new Error("Failed to add classification.");
    }
  } catch (error) {
    next(error);
  }
}

async function addInventory(req, res, next) {
  try {
    const invData = req.body;
    const result = await invModel.addInventory(invData);
    if (result) {
      res.redirect('/inventory');
    } else {
      throw new Error("Failed to add vehicle.");
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buildById,
  buildManagement,
  buildAddClassification,
  buildAddInventory,
  addClassification,
  addInventory
};
