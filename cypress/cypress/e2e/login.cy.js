describe("Login", () => {
  it("should login", () => {
    // Step 1: Visit the homepage
    cy.visit("/");

    // Step 2: Click on veterinarians tab
    cy.get("span:contains('Login')").click();

    // Step 4: Fill out the registration form
    cy.get('input[name="username"]').type("John1");
    cy.get('input[name="password"]').type("Doe");
    cy.get("span:contains('Login')").click();

    // Step 3: Verify George Franklin exists in the table
    cy.get("p:contains('John1')").should("exist");
  });
});
