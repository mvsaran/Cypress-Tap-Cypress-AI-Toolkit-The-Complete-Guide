describe("SauceDemo - Shopping Cart Suite", () => {
  let users;
  const targetItem = "Sauce Labs Backpack";
  const secondItem = "Sauce Labs Bike Light";

  before(() => {
    cy.fixture("users").then((data) => {
      users = data;
    });
  });

  beforeEach(() => {
    cy.login(users.validUser.username, users.validUser.password);
    cy.url().should("include", "/inventory.html");
  });

  it("1. Should add a product and navigate to the cart page", () => {
    cy.addItemToCart(targetItem);
    cy.get('[data-test="shopping-cart-link"]').click();

    cy.url().should("include", "/cart.html");
    cy.get('[data-test="title"]').should("have.text", "Your Cart");
  });

  it("2. Should verify the selected product details in the cart", () => {
    cy.addItemToCart(targetItem);
    cy.get('[data-test="shopping-cart-link"]').click();

    cy.get('[data-test="inventory-item"]').should("have.length", 1);
    cy.get('[data-test="inventory-item-name"]').should("have.text", targetItem);
    cy.get('[data-test="item-quantity"]').should("have.text", "1");
    cy.get('[data-test="inventory-item-price"]').should("contain.text", "$29.99");
  });

  it("3. Should remove a product directly from the cart", () => {
    cy.addItemToCart(targetItem);
    cy.addItemToCart(secondItem);
    cy.get('[data-test="shopping-cart-link"]').click();

    // Verify 2 items initially
    cy.get('[data-test="inventory-item"]').should("have.length", 2);
    cy.get('[data-test="shopping-cart-badge"]').should("have.text", "2");

    // Remove first item
    cy.get('[data-test="inventory-item"]')
      .contains('[data-test="inventory-item-name"]', targetItem)
      .parents('[data-test="inventory-item"]')
      .find('button[data-test^="remove"]')
      .click();

    // Verify 1 item left
    cy.get('[data-test="inventory-item"]').should("have.length", 1);
    cy.get('[data-test="inventory-item-name"]').should("have.text", secondItem);
    cy.get('[data-test="shopping-cart-badge"]').should("have.text", "1");

    // Remove remaining item
    cy.get('button[data-test^="remove"]').click();
    cy.get('[data-test="inventory-item"]').should("not.exist");
    cy.get('[data-test="shopping-cart-badge"]').should("not.exist");
  });

  it("4. Should continue shopping from the cart page and retain cart items", () => {
    cy.addItemToCart(targetItem);
    cy.get('[data-test="shopping-cart-link"]').click();
    cy.url().should("include", "/cart.html");

    // Click Continue Shopping
    cy.get('[data-test="continue-shopping"]').click();
    cy.url().should("include", "/inventory.html");

    // Badge should still retain count 1
    cy.get('[data-test="shopping-cart-badge"]').should("have.text", "1");
  });

  it("5. Should navigate from cart to checkout successfully", () => {
    cy.addItemToCart(targetItem);
    cy.get('[data-test="shopping-cart-link"]').click();

    cy.get('[data-test="checkout"]').should("be.visible").click();
    cy.url().should("include", "/checkout-step-one.html");
    cy.get('[data-test="title"]').should("have.text", "Checkout: Your Information");
  });
});
