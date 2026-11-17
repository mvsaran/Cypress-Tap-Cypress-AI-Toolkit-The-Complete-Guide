describe("SauceDemo - Product Catalog Suite", () => {
  let users;

  before(() => {
    cy.fixture("users").then((data) => {
      users = data;
    });
  });

  beforeEach(() => {
    cy.login(users.validUser.username, users.validUser.password);
    cy.url().should("include", "/inventory.html");
  });

  it("1. Should verify successful navigation to the inventory page", () => {
    cy.get('[data-test="title"]').should("have.text", "Products");
    cy.get('[data-test="inventory-container"]').should("be.visible");
    cy.get('[data-test="inventory-item"]').should("have.length", 6);
  });

  it("2. Should verify product names and prices are properly formatted", () => {
    cy.get('[data-test="inventory-item"]').each(($item) => {
      cy.wrap($item).find('[data-test="inventory-item-name"]').should("not.be.empty");
      cy.wrap($item)
        .find('[data-test="inventory-item-price"]')
        .invoke("text")
        .should("match", /^\$\d+\.\d{2}$/);
    });
  });

  it("3. Should sort products by price (low to high and high to low)", () => {
    // Sort low to high
    cy.get('[data-test="product-sort-container"]').select("lohi");

    cy.get('[data-test="inventory-item-price"]').then(($prices) => {
      const numericPrices = [...$prices].map((el) =>
        parseFloat(el.innerText.replace("$", ""))
      );
      const sortedPrices = [...numericPrices].sort((a, b) => a - b);
      expect(numericPrices).to.deep.equal(sortedPrices);
    });

    // Sort high to low
    cy.get('[data-test="product-sort-container"]').select("hilo");

    cy.get('[data-test="inventory-item-price"]').then(($prices) => {
      const numericPrices = [...$prices].map((el) =>
        parseFloat(el.innerText.replace("$", ""))
      );
      const sortedPrices = [...numericPrices].sort((a, b) => b - a);
      expect(numericPrices).to.deep.equal(sortedPrices);
    });
  });

  it("4. Should sort products alphabetically (A to Z and Z to A)", () => {
    // Sort Z to A
    cy.get('[data-test="product-sort-container"]').select("za");

    cy.get('[data-test="inventory-item-name"]').then(($names) => {
      const nameList = [...$names].map((el) => el.innerText.trim());
      const sortedDesc = [...nameList].sort((a, b) => b.localeCompare(a));
      expect(nameList).to.deep.equal(sortedDesc);
    });

    // Sort A to Z
    cy.get('[data-test="product-sort-container"]').select("az");

    cy.get('[data-test="inventory-item-name"]').then(($names) => {
      const nameList = [...$names].map((el) => el.innerText.trim());
      const sortedAsc = [...nameList].sort((a, b) => a.localeCompare(b));
      expect(nameList).to.deep.equal(sortedAsc);
    });
  });

  it("5. Should add products to cart and update the button state to Remove", () => {
    const itemToAdd = "Sauce Labs Backpack";
    cy.addItemToCart(itemToAdd);

    // Verify button text changes to Remove
    cy.get('[data-test="inventory-item"]')
      .contains('[data-test="inventory-item-name"]', itemToAdd)
      .parents('[data-test="inventory-item"]')
      .find('button[data-test^="remove"]')
      .should("be.visible")
      .and("have.text", "Remove");
  });

  it("6. Should verify cart badge count dynamically increases when items are added", () => {
    cy.get('[data-test="shopping-cart-badge"]').should("not.exist");

    cy.addItemToCart("Sauce Labs Backpack");
    cy.get('[data-test="shopping-cart-badge"]').should("have.text", "1");

    cy.addItemToCart("Sauce Labs Bike Light");
    cy.get('[data-test="shopping-cart-badge"]').should("have.text", "2");

    cy.addItemToCart("Sauce Labs Bolt T-Shirt");
    cy.get('[data-test="shopping-cart-badge"]').should("have.text", "3");
  });
});
