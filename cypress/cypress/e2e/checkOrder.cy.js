describe("Check order", () => {
  it("allows a user to check order", () => {
    // Step 1: Navigate to the specific owner's page which lists pets
    cy.visit("/");
    cy.get("//span[contains(text(),'Orders')]").click();
    cy.get("//p[contains(text(),'Sunglasses')]").should("exist");
  });
});
