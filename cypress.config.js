const { defineConfig } = require("cypress");

module.exports = defineConfig({
  defaultBrowser: "chrome",
  e2e: {
    baseUrl: "https://www.saucedemo.com",
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    video: true,
    videosFolder: "cypress/videos",
    videoCompression: 32,
    screenshotOnRunFailure: true,
    chromeWebSecurity: false,
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
    fixturesFolder: "cypress/fixtures",
    setupNodeEvents(on, config) {
      // Implement node event listeners here if required
      return config;
    },
  },
});
