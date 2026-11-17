// ***********************************************************
// Support file loaded automatically before your test files.
// ***********************************************************

// Import custom commands
import "./commands";

// Prevent arbitrary uncaught third-party exceptions on web apps from crashing test execution
Cypress.on("uncaught:exception", (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  return false;
});
