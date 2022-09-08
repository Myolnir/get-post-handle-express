const express = require("express");
const fs = require('fs');
const http2 = require('http2')
const http2Express = require('http2-express-bridge')
const app = http2Express(express)
const key = fs.readFileSync('encryption/key.pem');
const cert = fs.readFileSync('encryption/cert.pem');
const bp = require('body-parser')
const ca = fs.readFileSync('encryption/rootCA.pem')
const options = {
  key: key,
  cert: cert,
  ca: ca,
  allowHTTP1: true,
};
app.use(express.json())
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.post('/handle', (req, res) => {
  try {
    const apiKey = req.body.apiKey;
    console.log(`POST request: apiKey is ${apiKey}`);
    res.json({"response": "received"}).status(200);
  } catch (error) {
    console.log(error);
    res.json({"response": "failed"}).status(500);
  }
});

http2.createSecureServer(options, app).listen(3000);
