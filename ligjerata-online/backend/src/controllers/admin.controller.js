const adminService = require('../services/admin.service');

async function getAllUsers(req, res, next) {
  try {
    const users = await adminService.getAllUsers();
    res.json({ users });
  } catch (err) { next(err); }
}

async function updateRole(req, res, next) {
  try {
    const userId = parseInt(req.params.id);
    const { role } = req.body;
    const user = await adminService.updateUserRole(userId, role);
    res.json({ message: 'Roli u përditësua', user });
  } catch (err) { next(err); }
}

async function deleteUser(req, res, next) {
  try {
    const userId = parseInt(req.params.id);
    const result = await adminService.deleteUser(userId, req.user.id);
    res.json(result);
  } catch (err) { next(err); }
}

async function getStats(req, res, next) {
  try {
    const stats = await adminService.getGlobalStats();
    res.json(stats);
  } catch (err) { next(err); }
}

module.exports = { getAllUsers, updateRole, deleteUser, getStats };