describe("Login", () => {
  it("should login", () => {
    // Step 1: Visit the homepage
    cy.visit("/");

    // Step 2: Click on veterinarians tab
    cy.get("span:contains('Login')").click();

    // Step 4: Fill out the login form
    cy.get('input[name="username"]').type("John1");
    cy.get('input[name="password"]').type("Doe");
    cy.get(
      "body > div > div > main > form > button > span:first-of-type"
    ).click();

    // Step 3: Verify John1 exists in the table
    cy.get("p:contains('John1')").should("exist");
  });
});
