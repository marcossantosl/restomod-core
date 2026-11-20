const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const routes = require('./routes');
const errorMiddleware = require('./middlewares/error.middleware');
const { camelizeRequestBody, snakeifyResponse } = require('./middlewares/caseTransform.middleware');

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
app.use(snakeifyResponse);
app.use(camelizeRequestBody);

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

app.use(errorMiddleware);

module.exports = app;
