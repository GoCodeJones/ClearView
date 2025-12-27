require('dotenv').config();
const express = require('express');

const homeRoute = require('./routes/index');
const trustRoute = require('./routes/trust');
const feedRoute = require('./routes/feed');

const app = express();
const PORT = 3000;

app.use('/', homeRoute);
app.use(trustRoute);
app.use(feedRoute);


app.listen(PORT, () => {
  console.log(`Servidor ativo em http://localhost:${PORT}`);
});
