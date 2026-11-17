describe("SauceDemo - Live Bug & Fix Demo", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get('[data-test="username"]').type("standard_user");
    cy.get('[data-test="password"]').type("secret_sauce");
    cy.get('[data-test="login-button"]').click();
    cy.url().should("include", "/inventory.html");
  });

  it("Should add product to cart and verify button changes state", () => {
    // 1. Click Add to cart for the backpack
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    // 2. FIXED BY AGENT VIA CYPRESS TAP:
    // Live DOM snapshot confirmed button text is "Remove"
    cy.get('[data-test="remove-sauce-labs-backpack"]').should("have.text", "Remove");
  });
});
