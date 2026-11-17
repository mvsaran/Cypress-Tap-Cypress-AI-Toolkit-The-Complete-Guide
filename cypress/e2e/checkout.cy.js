describe("SauceDemo - Checkout & Payment Suite", () => {
  let users;
  const itemToBuy = "Sauce Labs Backpack";

  before(() => {
    cy.fixture("users").then((data) => {
      users = data;
    });
  });

  beforeEach(() => {
    cy.login(users.validUser.username, users.validUser.password);
    cy.addItemToCart(itemToBuy);
    cy.get('[data-test="shopping-cart-link"]').click();
    cy.get('[data-test="checkout"]').click();
    cy.url().should("include", "/checkout-step-one.html");
  });

  it("1. Should validate mandatory customer information fields", () => {
    // Missing First Name
    cy.get('[data-test="continue"]').click();
    cy.get('[data-test="error"]').should("be.visible").and("have.text", "Error: First Name is required");

    // Missing Last Name
    cy.get('[data-test="firstName"]').type(users.validUser.firstName);
    cy.get('[data-test="continue"]').click();
    cy.get('[data-test="error"]').should("be.visible").and("have.text", "Error: Last Name is required");

    // Missing Postal Code
    cy.get('[data-test="lastName"]').type(users.validUser.lastName);
    cy.get('[data-test="continue"]').click();
    cy.get('[data-test="error"]').should("be.visible").and("have.text", "Error: Postal Code is required");
  });

  it("2. Should successfully fill customer info and proceed to order overview", () => {
    cy.get('[data-test="firstName"]').type(users.validUser.firstName);
    cy.get('[data-test="lastName"]').type(users.validUser.lastName);
    cy.get('[data-test="postalCode"]').type(users.validUser.postalCode);
    cy.get('[data-test="continue"]').click();

    cy.url().should("include", "/checkout-step-two.html");
    cy.get('[data-test="title"]').should("have.text", "Checkout: Overview");
  });

  it("3. Should verify order pricing calculation, tax, and item details on overview page", () => {
    cy.get('[data-test="firstName"]').type(users.validUser.firstName);
    cy.get('[data-test="lastName"]').type(users.validUser.lastName);
    cy.get('[data-test="postalCode"]').type(users.validUser.postalCode);
    cy.get('[data-test="continue"]').click();

    // Verify item in summary
    cy.get('[data-test="inventory-item-name"]').should("have.text", itemToBuy);
    cy.get('[data-test="item-quantity"]').should("have.text", "1");
    cy.get('[data-test="inventory-item-price"]').should("have.text", "$29.99");

    // Verify subtotal, tax, and total
    cy.get('[data-test="subtotal-label"]').should("contain.text", "Item total: $29.99");
    cy.get('[data-test="tax-label"]').should("contain.text", "Tax: $2.40");
    cy.get('[data-test="total-label"]').should("contain.text", "Total: $32.39");
  });

  it("4. Should complete the checkout flow and verify the order confirmation", () => {
    cy.get('[data-test="firstName"]').type(users.validUser.firstName);
    cy.get('[data-test="lastName"]').type(users.validUser.lastName);
    cy.get('[data-test="postalCode"]').type(users.validUser.postalCode);
    cy.get('[data-test="continue"]').click();

    // Click finish to complete purchase
    cy.get('[data-test="finish"]').should("be.visible").click();

    // Assert checkout completion
    cy.url().should("include", "/checkout-complete.html");
    cy.get('[data-test="title"]').should("have.text", "Checkout: Complete!");
    cy.get('[data-test="complete-header"]')
      .should("be.visible")
      .and("have.text", "Thank you for your order!");
    cy.get('[data-test="complete-text"]').should("be.visible");
    cy.get('[data-test="back-to-products"]').should("be.visible");

    // Click back home and verify navigation back to inventory
    cy.get('[data-test="back-to-products"]').click();
    cy.url().should("include", "/inventory.html");
    cy.get('[data-test="shopping-cart-badge"]').should("not.exist");
  });
});
