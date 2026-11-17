// ***********************************************
// Custom Commands for SauceDemo E2E Test Suite
// ***********************************************

/**
 * Log into SauceDemo using provided credentials
 * @param {string} username
 * @param {string} password
 */
Cypress.Commands.add("login", (username, password) => {
  cy.visit("/");
  
  if (username) {
    cy.get('[data-test="username"]').clear().type(username);
  } else {
    cy.get('[data-test="username"]').clear();
  }

  if (password) {
    cy.get('[data-test="password"]').clear().type(password, { log: false });
  } else {
    cy.get('[data-test="password"]').clear();
  }

  cy.get('[data-test="login-button"]').click();
});

/**
 * Add a product to the cart by its displayed title
 * @param {string} productName
 */
Cypress.Commands.add("addItemToCart", (productName) => {
  cy.get('[data-test="inventory-item"]')
    .contains('[data-test="inventory-item-name"]', productName)
    .parents('[data-test="inventory-item"]')
    .find('button[data-test^="add-to-cart"]')
    .click();
});

/**
 * Remove a product from the cart by its displayed title
 * @param {string} productName
 */
Cypress.Commands.add("removeItemFromCart", (productName) => {
  cy.get('[data-test="inventory-item"]')
    .contains('[data-test="inventory-item-name"]', productName)
    .parents('[data-test="inventory-item"]')
    .find('button[data-test^="remove"]')
    .click();
});

/**
 * Get the current numeric cart count from the header badge
 */
Cypress.Commands.add("getCartBadgeCount", () => {
  return cy.get('[data-test="shopping-cart-badge"]').invoke("text").then((text) => parseInt(text.trim(), 10));
});
