describe("register", () => {
  it("successfully register", () => {
    // Step 1: Visit the homepage
    cy.visit("/");

    // Step 2: Click on veterinarians tab
    cy.get("span:contains('Register')").click();

    // Step 4: Fill out the registration form
    cy.get('input[name="username"]').type("John1");
    cy.get('input[name="password"]').type("Doe");
    cy.get('input[name="email"]').type("john@gmail.com");

    cy.get("span:contains('Register')").click();
    // Step 3: Verify George Franklin exists in the table
    cy.get("span:contains('Login')").should("exist");
  });
});
