describe("Edit cart", () => {
  it("allows a user to edit cart", () => {
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

    cy.get("header > div > button > span > span > svg > path").click();
    cy.get(
      "body > div > div > div:nth-of-type(3) > div > div > div > div > input"
    )
      .clear()
      .type("2");
    cy.get("div:contains('Cart updated successfully')").should("exist");
    cy.get("span:contains('PLACE ORDER')").click();
    cy.get("div:contains('Order placed successfully')").should("exist");
  });
});
