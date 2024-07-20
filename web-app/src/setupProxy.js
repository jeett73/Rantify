const { createProxyMiddleware } = require('http-proxy-middleware');
import config from './Config';

module.exports = function(app) {
  app.use(
    '/socket.io',
    createProxyMiddleware({
      target: `http://${config.ipAddress}:8080`, // Your backend server URL
      ws: true, // Enable WebSocket proxy
      changeOrigin: true, // Needed for virtual hosted sites
      secure: false, // Accept self-signed certificates, if any
    })
  );
};
