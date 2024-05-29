describe("Edit Pet Details", () => {
  it("allows a user to add to cart a product", () => {
    // Step 1: Navigate to the specific owner's page which lists pets
    cy.visit("/");
    cy.get(
      "//body/div[@id='root']/div[1]/div[3]/div[1]/div[1]/div[1]/div[2]/a[1]/span[1]"
    ).click();
    cy.get("//span[contains(text(),'Add to Cart')]").click();
    cy.get("//div[contains(text(),'Product added to cart')]").should("exist");
  });
});
