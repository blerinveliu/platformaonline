const express = require('express');
const cors = require('cors');
const config = require('./config');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Serveri funksionon!' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/ligjerata', require('./routes/ligjerata'));
app.use('/api/admin', require('./routes/admin'));

app.use(notFound);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`✅ Serveri u nis në http://localhost:${config.port}`);
  console.log(`📦 Mjedisi: ${config.nodeEnv}`);
});