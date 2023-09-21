const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});

// Create Express Server
const app = express();

// Configuration
const PORT = process.env.PORT || 80;
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

app.get('*', function(req, res) {
  proxy.web(req, res, { target: `${req.protocol}://${req.hostname}` });
});

// Start the Proxy
app.listen(PORT, HOST, () => {
   console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
