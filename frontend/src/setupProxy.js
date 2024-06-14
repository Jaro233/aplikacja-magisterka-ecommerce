// const { createProxyMiddleware } = require("http-proxy-middleware");

// module.exports = function (app) {
//   // Proxy API requests
//   app.use(
//     "/api/products",
//     createProxyMiddleware({
//       target: window._env_.REACT_APP_PRODUCT_SERVICE_URL,
//       changeOrigin: true,
//       onProxyReq: (proxyReq, req, res) => {
//         console.log(
//           `Proxying request to: ${window._env_.REACT_APP_PRODUCT_SERVICE_URL}`
//         );
//       },
//       onError: (err, req, res) => {
//         console.error("Proxy error:", err);
//       },
//     })
//   );
//   app.use(
//     "/api/users",
//     createProxyMiddleware({
//       target: window._env_.REACT_APP_USER_SERVICE_URL,
//       changeOrigin: true,
//       pathRewrite: {
//         "^/api/users": "",
//       },
//     })
//   );
//   app.use(
//     "/api/cart",
//     createProxyMiddleware({
//       target: window._env_.REACT_APP_CART_SERVICE_URL,
//       changeOrigin: true,
//       pathRewrite: {
//         "^/api/cart": "",
//       },
//     })
//   );
//   app.use(
//     "/api/orders",
//     createProxyMiddleware({
//       target: window._env_.REACT_APP_ORDER_SERVICE_URL,
//       changeOrigin: true,
//       pathRewrite: {
//         "^/api/orders": "",
//       },
//     })
//   );
// };
