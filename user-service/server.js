const app = require("./app");
const sequelize = require("./config/database");

sequelize
  .sync()
  .then(() => {
    app.listen(5001, () => {
      console.log("User service running on port 5001");
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
