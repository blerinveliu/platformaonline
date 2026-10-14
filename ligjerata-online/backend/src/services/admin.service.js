const prisma = require('../db');
const AppError = require('../utils/AppError');

async function getAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          ligjeratat: true,
          enrollments: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function updateUserRole(userId, newRole) {
  if (!['student', 'profesor', 'admin'].includes(newRole)) {
    throw new AppError('Rol i pavlefshëm', 400);
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User nuk u gjet', 404);

  return prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
    select: { id: true, email: true, name: true, role: true },
  });
}

async function deleteUser(userId, currentUserId) {
  if (userId === currentUserId) {
    throw new AppError('Nuk mund të fshini veten', 400);
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User nuk u gjet', 404);

  await prisma.user.delete({ where: { id: userId } });
  return { message: 'User u fshi me sukses' };
}

async function getGlobalStats() {
  const [totalUsers, totalStudents, totalProfs, totalLigjerata, totalEnrollments] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'student' } }),
    prisma.user.count({ where: { role: 'profesor' } }),
    prisma.ligjerata.count(),
    prisma.enrollment.count(),
  ]);

  return { totalUsers, totalStudents, totalProfs, totalLigjerata, totalEnrollments };
}

module.exports = { getAllUsers, updateUserRole, deleteUser, getGlobalStats };