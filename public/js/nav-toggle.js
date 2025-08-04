console.log('nav-toggle.js loaded');

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");

  console.log("Nav Toggle:", navToggle);
  console.log("Main Nav:", mainNav);

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      mainNav.classList.toggle("open");
      console.log("Toggle clicked! Current classes:", mainNav.classList);
    });
  } else {
    console.error("navToggle or mainNav not found");
  }
});