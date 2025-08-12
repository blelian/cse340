const Message = require("../models/messageModel");
const utils = require("../utilities"); // to get nav menu

// Show the contact form (GET /contact)
exports.showContactForm = async (req, res, next) => {
  try {
    const nav = await utils.getNav();
    res.render("contact/contact", {
      title: "Contact Us",
      useFormsCSS: true,
      bodyClass: "contact-page",
      errors: [],
      formData: {},
      nav,               // Pass nav here
    });
  } catch (error) {
    next(error);
  }
};

// Handle form submission (POST /contact)
exports.handleContactForm = async (req, res, next) => {
  try {
    const nav = await utils.getNav();

    const { name, email, message } = req.body;
    const errors = [];

    // Basic validation
    if (!name || name.trim() === "") errors.push("Name is required.");
    if (!email || email.trim() === "") errors.push("Email is required.");
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) errors.push("Invalid email format.");
    }
    if (!message || message.trim() === "") errors.push("Message is required.");

    if (errors.length > 0) {
      // Re-render form with errors and previous form data, plus nav
      return res.status(400).render("contact/contact", {
        title: "Contact Us",
        useFormsCSS: true,
        bodyClass: "contact-page",
        errors,
        formData: { name, email, message },
        nav,
      });
    }

    // Save message to DB
    await Message.insert(name.trim(), email.trim(), message.trim());

    // Render success page with nav
    res.render("contact/contact-success", {
      title: "Message Sent",
      useFormsCSS: true,
      bodyClass: "contact-success-page",
      nav,
    });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).render("errors/500", {
      title: "500 - Server Error",
      message: "Error saving your message. Please try again later.",
      useFormsCSS: true,
      bodyClass: "error-500",
      nav: await utils.getNav(),  // best effort to show nav even on error
    });
  }
};
