const express = require('express');
const ctrl = require('../controllers/ligjerata.controller');
const { authenticate, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { ligjerataSchema, ligjerataUpdateSchema } = require('../validators/ligjerata.validator');

const router = express.Router();

// Publike
router.get('/', ctrl.getAll);
router.get('/statistika', authenticate, ctrl.getStatistika);
router.get('/e-mia/enrolled', authenticate, ctrl.getMyEnrolled);
router.get('/mia', authenticate, requireRole('profesor', 'admin'), ctrl.getAll);
router.get('/:id/studente', authenticate, requireRole('profesor', 'admin'), ctrl.getStudente);
router.get('/:id', authenticate, ctrl.getById);

// CRUD
router.post('/', authenticate, requireRole('profesor', 'admin'), validate(ligjerataSchema), ctrl.create);
router.put('/:id', authenticate, requireRole('profesor', 'admin'), validate(ligjerataUpdateSchema), ctrl.update);
router.delete('/:id', authenticate, requireRole('profesor', 'admin'), ctrl.remove);

// Enrollment
router.post('/:id/enroll', authenticate, ctrl.enroll);
router.delete('/:id/enroll', authenticate, ctrl.unenroll);

module.exports = router;