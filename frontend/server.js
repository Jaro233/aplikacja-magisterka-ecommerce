const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "build")));

// An endpoint to check the health of the frontend
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Only start the server if this script is run directly (not imported as a module)
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Frontend health check server listening on port ${port}`);
  });
}

module.exports = app;
