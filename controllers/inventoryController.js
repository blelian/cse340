const invModel = require('../models/inventoryModel');
const utils = require('../utilities');

async function buildById(req, res, next) {
  try {
    const invId = parseInt(req.params.invId);
    const data = await invModel.getVehicleById(invId);
    const nav = await utils.getNav();
    res.render('inventory/detail', {
      title: `${data.inv_make} ${data.inv_model}`,
      nav,
      vehicle: data,
    });
  } catch (error) {
    next(error);
  }
}

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

async function buildAddInventory(req, res, next) {
  try {
    const nav = await utils.getNav();
    const classifications = await invModel.getAllClassifications();
    res.render('inventory/add_inventory', {
      title: 'Add New Vehicle',
      nav,
      classifications,
      // preserve sticky values
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

async function addClassification(req, res, next) {
  try {
    const { classification_name } = req.body;
    const result = await invModel.addClassification(classification_name);
    if (result) {
      res.redirect('/inventory');
    } else {
      throw new Error('Classification could not be added');
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
      throw new Error('Vehicle could not be added');
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
  addInventory,
};
