const invModel = require('../models/inventoryModel');
const utils = require('../utilities');

// Build vehicle detail view
async function buildById(req, res, next) {
  try {
    const invId = parseInt(req.params.invId);
    const data = await invModel.getVehicleById(invId);
    const nav = await utils.getNav();

    if (!data) {
      const err = new Error('Vehicle not found');
      err.status = 404;
      throw err;
    }

    res.render('inventory/detail', {
      title: `${data.inv_make} ${data.inv_model}`,
      nav,
      vehicle: data,
    });
  } catch (error) {
    next(error);
  }
}

// Inventory management view
async function buildManagement(req, res, next) {
  try {
    const nav = await utils.getNav();
    res.render('inventory/management', {
      title: 'Inventory Management',
      nav,
    });
  } catch (error) {
    next(error);
  }
}

// Add classification form
async function buildAddClassification(req, res, next) {
  try {
    const nav = await utils.getNav();
    res.render('inventory/add_classification', {
      title: 'Add New Classification',
      nav,
    });
  } catch (error) {
    next(error);
  }
}

// Add inventory form
async function buildAddInventory(req, res, next) {
  try {
    const nav = await utils.getNav();
    const classifications = await invModel.getAllClassifications();

    res.render('inventory/add_inventory', {
      title: 'Add New Vehicle',
      nav,
      classifications,
      inv_make: req.body?.inv_make || '',
      inv_model: req.body?.inv_model || '',
      inv_year: req.body?.inv_year || '',
      inv_description: req.body?.inv_description || '',
      inv_image: req.body?.inv_image || '/images/vehicles/no-image.png',
      inv_thumbnail: req.body?.inv_thumbnail || '/images/vehicles/no-image.png',
      inv_price: req.body?.inv_price || '',
      inv_miles: req.body?.inv_miles || '',
      inv_color: req.body?.inv_color || '',
      classification_id: req.body?.classification_id || '',
    });
  } catch (error) {
    next(error);
  }
}

// Process classification form submission
async function addClassification(req, res, next) {
  try {
    const { classification_name } = req.body;
    const result = await invModel.addClassification(classification_name);

    if (result) {
      req.flash('notice', `Classification "${classification_name}" added successfully.`);
      return res.redirect('/inventory/add-classification');
    } else {
      req.flash('error', 'Classification could not be added. Please try again.');
      return res.redirect('/inventory/add-classification');
    }
  } catch (error) {
    req.flash('error', 'An unexpected error occurred. Please try again.');
    return res.redirect('/inventory/add-classification');
  }
}

// Process inventory form submission
async function addInventory(req, res, next) {
  try {
    const invData = req.body;
    const result = await invModel.addInventory(invData);

    if (result) {
      req.flash('notice', `Vehicle "${invData.inv_make} ${invData.inv_model}" added successfully.`);
      return res.redirect('/inventory/add-inventory');
    } else {
      req.flash('error', 'Vehicle could not be added. Please try again.');
      return res.redirect('/inventory/add-inventory');
    }
  } catch (error) {
    req.flash('error', 'An unexpected error occurred. Please try again.');
    return res.redirect('/inventory/add-inventory');
  }
}

// Build vehicles by classification view
async function buildByClassificationId(req, res, next) {
  try {
    const classificationId = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classificationId);
    const nav = await utils.getNav();
    const grid = await utils.buildClassificationGrid(data);

    const className = data.length > 0 ? data[0].classification_name : "Vehicles";

    res.render('inventory/classification', {
      title: `${className} vehicles`,
      nav,
      grid,
    });
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
  addInventory,
  buildByClassificationId,
};
