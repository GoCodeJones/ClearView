const express = require('express');
const homeRoute = require('./routes/index');

const app = express();
const PORT = 3000;

app.use('/', homeRoute);

app.listen(PORT, () => {
  console.log(`Servidor ativo em http://localhost:${PORT}`);
});
