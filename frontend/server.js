const express = require("express");
const path = require("path");
const fs = require("fs");
const { createProxyMiddleware } = require("http-proxy-middleware");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

fs.readFile(
  path.join(__dirname, "build", "index.html"),
  "utf8",
  (err, data) => {
    if (err) {
      console.error("Error reading index.html:", err);
      return;
    }
    console.log("Updating the Config in Index.html...");
    let result = data;
    // Replace placeholders with actual environment variable values
    result = result.replace(
      "__USER_SERVICE__",
      process.env.REACT_APP_USER_SERVICE_URL
      // process.env.REACT_APP_USER_SERVICE_URL || "http://localhost:5001"
    );
    result = result.replace(
      "__PRODUCT_SERVICE__",
      process.env.REACT_APP_PRODUCT_SERVICE_URL
      // process.env.REACT_APP_PRODUCT_SERVICE_URL || "http://localhost:5002"
    );
    result = result.replace(
      "__ORDER_SERVICE__",
      process.env.REACT_APP_ORDER_SERVICE_URL
      // process.env.REACT_APP_ORDER_SERVICE_URL || "http://localhost:5003"
    );
    result = result.replace(
      "__CART_SERVICE__",
      process.env.REACT_APP_CART_SERVICE_URL
      // process.env.REACT_APP_CART_SERVICE_URL || "http://localhost:5004"
    );
    result = result.replace(
      "__NOTIFICATION_SERVICE__",
      process.env.REACT_APP_NOTIFICATION_SERVICE_URL
      // process.env.REACT_APP_CART_SERVICE_URL || "http://localhost:5004"
    );

    // Write modified content to a new file or same file
    fs.writeFile(
      path.join(__dirname, "build", "index.html"),
      result,
      "utf8",
      (err) => {
        if (err) {
          console.error("Error writing index.html:", err);
        }
      }
    );
    console.log("Updated Config Successfully...");
  }
);

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "build")));

// // Proxy API requests
// app.use(
//   "/api/products",
//   createProxyMiddleware({
//     target: process.env.REACT_APP_PRODUCT_SERVICE_URL,
//     changeOrigin: true,
//     pathRewrite: { "^/api/products": "" },
//     onProxyReq: (proxyReq, req, res) => {
//       console.log(
//         `Proxying request to: ${process.env.REACT_APP_PRODUCT_SERVICE_URL}`
//       );
//     },
//     onError: (err, req, res) => {
//       console.error("Proxy error:", err);
//     },
//   })
// );
// app.use(
//   "/api/users",
//   createProxyMiddleware({
//     target: process.env.REACT_APP_USER_SERVICE_URL,
//     changeOrigin: true,
//     pathRewrite: {
//       "^/api/users": "",
//     },
//   })
// );
// app.use(
//   "/api/cart",
//   createProxyMiddleware({
//     target: process.env.REACT_APP_CART_SERVICE_URL,
//     changeOrigin: true,
//     pathRewrite: {
//       "^/api/cart": "",
//     },
//   })
// );
// app.use(
//   "/api/orders",
//   createProxyMiddleware({
//     target: process.env.REACT_APP_ORDER_SERVICE_URL,
//     changeOrigin: true,
//     pathRewrite: {
//       "^/api/orders": "",
//     },
//   })
// );

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// An endpoint to check the health of the frontend
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

// Only start the server if this script is run directly (not imported as a module)
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Frontend server listening on port ${port}`);
  });
}

module.exports = app;
