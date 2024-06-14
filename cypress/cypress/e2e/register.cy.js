describe("register", () => {
  it("successfully register", () => {
    // Step 1: Visit the homepage
    cy.visit("/");

    // Step 2: Click on register tab
    cy.get("span:contains('Register')").click();

    // Step 4: Fill out the registration form
    cy.get('input[name="username"]').type("John1");
    cy.get('input[name="password"]').type("Doe");
    cy.get('input[name="email"]').type("john@gmail.com");

    cy.get("div > main > form > button > span:first-of-type").click();
    // Step 3: Verify Login exists in the table
    cy.get(
      "body > div > div > div:nth-of-type(2) > div > div > div:first-of-type > div:nth-of-type(2)"
    ).should("exist");
  });
});
