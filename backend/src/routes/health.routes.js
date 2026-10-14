const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Serveri është aktiv',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;