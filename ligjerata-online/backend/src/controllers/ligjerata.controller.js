const ligjerataService = require('../services/ligjerata.service');

async function getAll(req, res, next) {
  try {
    const ligjeratat = await ligjerataService.getAll(req.query);
    res.json({ ligjeratat });
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const ligjerata = await ligjerataService.getById(parseInt(req.params.id), req.user.id);
    res.json({ ligjerata });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const ligjerata = await ligjerataService.create(req.body, req.user.id);
    res.status(201).json({ message: 'Ligjerata u krijua me sukses', ligjerata });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const ligjerata = await ligjerataService.update(parseInt(req.params.id), req.body, req.user);
    res.json({ message: 'Ligjerata u përditësua', ligjerata });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const result = await ligjerataService.remove(parseInt(req.params.id), req.user);
    res.json(result);
  } catch (err) { next(err); }
}

async function enroll(req, res, next) {
  try {
    const enrollment = await ligjerataService.enroll(parseInt(req.params.id), req.user.id);
    res.status(201).json({ message: 'U regjistruat me sukses', enrollment });
  } catch (err) { next(err); }
}

async function unenroll(req, res, next) {
  try {
    const result = await ligjerataService.unenroll(parseInt(req.params.id), req.user.id);
    res.json(result);
  } catch (err) { next(err); }
}

async function getMyEnrolled(req, res, next) {
  try {
    const ligjeratat = await ligjerataService.getMyEnrolled(req.user.id);
    res.json({ ligjeratat });
  } catch (err) { next(err); }
}

async function getStatistika(req, res, next) {
  try {
    const statistika = await ligjerataService.getStatistika(req.user);
    res.json(statistika);
  } catch (err) { next(err); }
}

async function getStudente(req, res, next) {
  try {
    const studente = await ligjerataService.getStudente(parseInt(req.params.id), req.user);
    res.json({ studente });
  } catch (err) { next(err); }
}

module.exports = { getAll, getById, create, update, remove, enroll, unenroll, getMyEnrolled, getStatistika, getStudente };