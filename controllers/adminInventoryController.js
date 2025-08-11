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

    const errors = [];

    if (!classification_id) errors.push("Classification is required.");
    if (!inv_make || inv_make.trim() === "") errors.push("Make is required.");
    if (!inv_model || inv_model.trim() === "") errors.push("Model is required.");
    if (!inv_year || isNaN(Number(inv_year))) errors.push("Valid Year is required.");
    if (!inv_description || inv_description.trim() === "") errors.push("Description is required.");
    if (!inv_price || isNaN(Number(inv_price))) errors.push("Valid Price is required.");
    if (!inv_miles || isNaN(Number(inv_miles))) errors.push("Valid Miles is required.");
    if (!inv_color || inv_color.trim() === "") errors.push("Color is required.");

    if (errors.length > 0) {
      const nav = await utilities.getNav();

      const classificationResult = await pool.query(
        "SELECT * FROM classification ORDER BY classification_name"
      );
      const classifications = classificationResult.rows;

      return res.status(400).render("admin/inventory/edit", {
        title: `Edit Inventory Item: ${inv_make} ${inv_model}`,
        nav,
        classifications,
        inventoryItem: {
          inv_id: id,
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
        },
        errors,
        user: req.user,
        useFormsCSS: true,
      });
    }

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
