const express = require('express');
const http = require('http');
const url = require('url');

const app = express();

app.use((req, res) => {
  const targetUrl = req.query.target;
  if (!targetUrl) {
    res.status(400).send('Missing target URL parameter');
    return;
  }
  
  const target = url.parse(targetUrl);
  const options = {
    hostname: target.hostname,
    port: target.port || 80,
    path: target.path,
    method: req.method,
    headers: req.headers
  };
  
  const proxyReq = http.request(options, (proxyRes) => {
    res.status(proxyRes.statusCode);
    proxyRes.pipe(res);
  });
  
  req.pipe(proxyReq);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});
