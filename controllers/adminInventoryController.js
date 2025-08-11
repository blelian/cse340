// controllers/adminInventoryController.js
const pool = require("../database");
const utilities = require("../utilities");

async function listInventory(req, res, next) {
  try {
    const nav = await utilities.getNav();

    const classificationResult = await pool.query("SELECT * FROM classification ORDER BY classification_name");
    const classifications = classificationResult.rows;

    const selectedClassificationId = req.query.classification_id ? parseInt(req.query.classification_id) : null;

    let inventoryResult;
    if (selectedClassificationId) {
      inventoryResult = await pool.query(
        `SELECT inventory.*, classification.classification_name 
         FROM inventory 
         JOIN classification ON inventory.classification_id = classification.classification_id 
         WHERE inventory.classification_id = $1
         ORDER BY inventory.inv_make`,
        [selectedClassificationId]
      );
    } else {
      inventoryResult = await pool.query(
        `SELECT inventory.*, classification.classification_name 
         FROM inventory 
         JOIN classification ON inventory.classification_id = classification.classification_id
         ORDER BY inventory.inv_make`
      );
    }

    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      classifications,
      selectedClassificationId,
      inventory: inventoryResult.rows,
      user: req.user,
      useFormsCSS: false,
    });
  } catch (error) {
    next(error);
  }
}

async function showAddForm(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classificationResult = await pool.query("SELECT * FROM classification ORDER BY classification_name");
    const classifications = classificationResult.rows;

    res.render("admin/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      classifications,
      user: req.user,
      useFormsCSS: true,
    });
  } catch (error) {
    next(error);
  }
}

async function handleAdd(req, res, next) {
  try {
    const {
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    } = req.body;

    await pool.query(
      `INSERT INTO inventory
       (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
      ]
    );

    res.redirect("/admin/inventory");
  } catch (error) {
    next(error);
  }
}

async function showEditForm(req, res, next) {
  try {
    const { id } = req.params;
    const nav = await utilities.getNav();

    const classificationResult = await pool.query("SELECT * FROM classification ORDER BY classification_name");
    const classifications = classificationResult.rows;

    const invResult = await pool.query("SELECT * FROM inventory WHERE inv_id = $1", [id]);
    if (invResult.rowCount === 0) {
      return res.status(404).send("Inventory item not found");
    }
    const vehicle = invResult.rows[0];

    res.render("admin/edit-inventory", {
      title: `Edit Inventory Item: ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      classifications,
      vehicle,
      user: req.user,
      useFormsCSS: true,
    });
  } catch (error) {
    next(error);
  }
}

async function handleEdit(req, res, next) {
  try {
    const { id } = req.params;
    const {
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    } = req.body;

    await pool.query(
      `UPDATE inventory SET
        classification_id=$1,
        inv_make=$2,
        inv_model=$3,
        inv_year=$4,
        inv_description=$5,
        inv_image=$6,
        inv_thumbnail=$7,
        inv_price=$8,
        inv_miles=$9,
        inv_color=$10
       WHERE inv_id=$11`,
      [
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        id,
      ]
    );

    res.redirect("/admin/inventory");
  } catch (error) {
    next(error);
  }
}

async function handleDelete(req, res, next) {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM inventory WHERE inv_id = $1", [id]);
    res.redirect("/admin/inventory");
  } catch (error) {
    next(error);
  }
}

// New: Show the Add Classification form
async function showAddClassificationForm(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("admin/inventory/add-classification", {
      title: "Add Classification",
      nav,
      user: req.user,
      useFormsCSS: true,
    });
  } catch (error) {
    next(error);
  }
}

// New: Handle Add Classification POST
async function handleAddClassification(req, res, next) {
  try {
    const { classification_name } = req.body;

    if (!classification_name) {
      req.flash("error", "Classification name is required.");
      return res.redirect("/admin/inventory/add-classification");
    }

    const sql = "INSERT INTO classification (classification_name) VALUES ($1)";
    await pool.query(sql, [classification_name]);

    req.flash("success", "Classification added successfully.");
    res.redirect("/admin/inventory");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listInventory,
  showAddForm,
  handleAdd,
  showEditForm,
  handleEdit,
  handleDelete,

  showAddClassificationForm,
  handleAddClassification,
};
