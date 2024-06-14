describe("Add to cart", () => {
  it("allows a user to add to cart a product", () => {
    // Step 1: Navigate to the specific owner's page which lists pets
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

    cy.get(
      "body > div > div > div:nth-of-type(3) > div > div:first-of-type > div > div:nth-of-type(2) > a > span:first-of-type"
    ).click();
    cy.get("span:contains('Add to Cart')").click();
    cy.get("div:contains('Product added to cart')").should("exist");
  });
});
