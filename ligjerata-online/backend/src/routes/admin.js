const express = require('express');
const ctrl = require('../controllers/admin.controller');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// Të gjitha rrugët kërkojnë admin
router.use(authenticate, requireRole('admin'));

router.get('/users', ctrl.getAllUsers);
router.get('/stats', ctrl.getStats);
router.put('/users/:id/role', ctrl.updateRole);
router.delete('/users/:id', ctrl.deleteUser);

module.exports = router;