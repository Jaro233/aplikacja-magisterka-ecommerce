describe("Edit cart", () => {
  it("allows a user to edit cart", () => {
    // Step 1: Navigate to the specific owner's page which lists pets
    cy.visit("/");
    cy.get(
      "//body[1]/div[1]/div[1]/div[1]/header[1]/div[1]/button[1]/span[1]/span[1]/svg[1]/path[1]"
    ).click();
    cy.get('//body/div[@id='root']/div[1]/div[3]/div[1]/div[1]/div[1]/div[1]/input[1]').clear().type("2");
    cy.get("//div[contains(text(),'Cart updated successfully')]").should("exist");
    cy.get(
      "//span[contains(text(),'PLACE ORDER')]"
    ).click();
    cy.get("//div[contains(text(),'Order placed successfully')]").should("exist");
  });
});
