describe("Check home page", () => {
  it("Check home page", () => {
    // Step 1: Visit the homepage
    cy.visit("/");

    cy.contains("Sunglasses").should("exist");
    cy.contains("Headphones").should("exist");
  });
});
