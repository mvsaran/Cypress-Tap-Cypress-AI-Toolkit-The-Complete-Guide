describe("SauceDemo - Authentication Suite", () => {
  let users;

  before(() => {
    cy.fixture("users").then((data) => {
      users = data;
    });
  });

  beforeEach(() => {
    cy.visit("/");
  });

  it("1. Should display the login page elements properly", () => {
    cy.get(".login_logo").should("be.visible").and("have.text", "Swag Labs");
    cy.get('[data-test="username"]').should("be.visible").and("have.attr", "placeholder", "Username");
    cy.get('[data-test="password"]').should("be.visible").and("have.attr", "placeholder", "Password");
    cy.get('[data-test="login-button"]').should("be.visible").and("have.value", "Login");
  });

  it("2. Should successfully log in with valid credentials", () => {
    cy.login(users.validUser.username, users.validUser.password);
    
    // Assert navigation to inventory page
    cy.url().should("include", "/inventory.html");
    cy.get('[data-test="title"]').should("be.visible").and("have.text", "Products");
    cy.get('[data-test="shopping-cart-link"]').should("be.visible");
    cy.get('[data-test="inventory-item"]').should("have.length.greaterThan", 0);
  });

  it("3. Should reject login with an invalid username", () => {
    cy.login(users.invalidUsername.username, users.invalidUsername.password);

    cy.get('[data-test="error"]')
      .should("be.visible")
      .and("contain.text", users.invalidUsername.expectedError);
    cy.url().should("not.include", "/inventory.html");
  });

  it("4. Should reject login with an invalid password", () => {
    cy.login(users.invalidPassword.username, users.invalidPassword.password);

    cy.get('[data-test="error"]')
      .should("be.visible")
      .and("contain.text", users.invalidPassword.expectedError);
    cy.url().should("not.include", "/inventory.html");
  });

  it("5. Should show locked out error for a locked-out user", () => {
    cy.login(users.lockedOutUser.username, users.lockedOutUser.password);

    cy.get('[data-test="error"]')
      .should("be.visible")
      .and("have.text", users.lockedOutUser.expectedError);
    cy.url().should("not.include", "/inventory.html");
  });

  it("6. Should validate empty username and empty password validation errors", () => {
    // Both empty
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]')
      .should("be.visible")
      .and("have.text", users.emptyUsername.expectedError);

    // Empty password with username filled
    cy.get('[data-test="username"]').type(users.validUser.username);
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]')
      .should("be.visible")
      .and("have.text", users.emptyPassword.expectedError);
  });
});
