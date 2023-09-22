const fs = require('fs')
const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({
	secure:true,
  ssl: {
    key: fs.readFileSync('key.pem', 'utf8'),
    cert: fs.readFileSync('cert.pem', 'utf8')
  }
});

// Create Express Server
const app = express();

// Configuration
const PORT = process.env.PORT || 80;


// Logging
app.use(morgan('dev'));



// Info GET endpoint
app.get('/info', (req, res, next) => {
   res.send('This is a proxy service which proxies to Billing and Account APIs.');
});

app.get('*', function(req, res) {
  try {
	  console.log(req.protocol, req.hostname);
	  const {protocol, hostname} = req;
	  const targetUrl = `${protocol}${hostname}`;
    proxy.web(req, res, { 
	    changeOrigin: true, 
	    target: targetUrl
    });
  } catch (e) {
	  res.send(e);
  }

});

// Start the Proxy
app.listen(PORT, () => {
   console.log(`Starting Proxy at $${PORT}`);
});
