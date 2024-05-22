const SequelizeMock = require("sequelize-mock");
const DBConnectionMock = new SequelizeMock();

const ProductMock = DBConnectionMock.define("Products", {
  id: 1,
  name: "Product 1",
  description: "Description for product 1",
  price: 10.0,
  imageUrl: "https://example.com/image.jpg",
  createdAt: new Date(),
  updatedAt: new Date(),
});

module.exports = {
  Product: ProductMock,
  SequelizeMock,
  DBConnectionMock,
};
