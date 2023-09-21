const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');


// Create Express Server
const app = express();

// Configuration
const PORT = 3000;
const HOST = "localhost";
const API_SERVICE_URL = "https://jsonplaceholder.typicode.com";


// Logging
app.use(morgan('dev'));



// Info GET endpoint
app.get('/info', (req, res, next) => {
   res.send('This is a proxy service which proxies to Billing and Account APIs.');
});


// Proxy endpoints
app.use('/json_placeholder', createProxyMiddleware({
   target: API_SERVICE_URL,
   changeOrigin: true,
   pathRewrite: {
       [`^/json_placeholder`]: '',
   },
}));

// Start the Proxy
app.listen(PORT, HOST, () => {
   console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
