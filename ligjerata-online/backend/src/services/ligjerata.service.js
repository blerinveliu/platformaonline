const prisma = require('../db');
const AppError = require('../utils/AppError');

async function getAll({ kategori, search }) {
  const where = {};
  if (kategori) where.kategori = kategori;
  if (search) {
    where.OR = [
      { titull: { contains: search, mode: 'insensitive' } },
      { pershkrim: { contains: search, mode: 'insensitive' } },
    ];
  }

  return prisma.ligjerata.findMany({
    where,
    include: {
      profesor: { select: { id: true, name: true } },
      _count: { select: { enrollments: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function getById(id, userId) {
  const ligjerata = await prisma.ligjerata.findUnique({
    where: { id },
    include: {
      profesor: { select: { id: true, name: true, email: true } },
      _count: { select: { enrollments: true } },
    },
  });
  if (!ligjerata) throw new AppError('Ligjerata nuk u gjet', 404);

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_ligjerataId: { userId, ligjerataId: id } },
  });

  return { ...ligjerata, isEnrolled: !!enrollment };
}

async function create(data, profesorId) {
  return prisma.ligjerata.create({
    data: { ...data, profesorId },
  });
}

async function update(id, data, user) {
  const ekziston = await prisma.ligjerata.findUnique({ where: { id } });
  if (!ekziston) throw new AppError('Ligjerata nuk u gjet', 404);
  if (ekziston.profesorId !== user.id && user.role !== 'admin') {
    throw new AppError('Nuk keni leje', 403);
  }

  return prisma.ligjerata.update({ where: { id }, data });
}

async function remove(id, user) {
  const ekziston = await prisma.ligjerata.findUnique({ where: { id } });
  if (!ekziston) throw new AppError('Ligjerata nuk u gjet', 404);
  if (ekziston.profesorId !== user.id && user.role !== 'admin') {
    throw new AppError('Nuk keni leje', 403);
  }

  await prisma.ligjerata.delete({ where: { id } });
  return { message: 'Ligjerata u fshi me sukses' };
}

async function enroll(ligjerataId, userId) {
  const ligjerata = await prisma.ligjerata.findUnique({ where: { id: ligjerataId } });
  if (!ligjerata) throw new AppError('Ligjerata nuk u gjet', 404);

  const ekziston = await prisma.enrollment.findUnique({
    where: { userId_ligjerataId: { userId, ligjerataId } },
  });
  if (ekziston) throw new AppError('Jeni regjistruar tashmë', 409);

  return prisma.enrollment.create({ data: { userId, ligjerataId } });
}

async function unenroll(ligjerataId, userId) {
  const ekziston = await prisma.enrollment.findUnique({
    where: { userId_ligjerataId: { userId, ligjerataId } },
  });
  if (!ekziston) throw new AppError('Nuk jeni regjistruar', 404);

  await prisma.enrollment.delete({
    where: { userId_ligjerataId: { userId, ligjerataId } },
  });
  return { message: 'U çregjistruat me sukses' };
}

async function getMyEnrolled(userId) {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      ligjerata: {
        include: {
          profesor: { select: { id: true, name: true } },
          _count: { select: { enrollments: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return enrollments.map((e) => ({ ...e.ligjerata, enrolledAt: e.createdAt }));
}

async function getStatistika(user) {
  if (user.role === 'profesor') {
    const [totalLigjerata, totalEnrollments, totalStudente] = await Promise.all([
      prisma.ligjerata.count({ where: { profesorId: user.id } }),
      prisma.enrollment.count({ where: { ligjerata: { profesorId: user.id } } }),
      prisma.enrollment.groupBy({
        by: ['userId'],
        where: { ligjerata: { profesorId: user.id } },
      }),
    ]);
    return { totalLigjerata, totalEnrollments, totalStudente: totalStudente.length };
  }

  const [totalLigjerata, totalEnrollments] = await Promise.all([
    prisma.ligjerata.count(),
    prisma.enrollment.count({ where: { userId: user.id } }),
  ]);
  return { totalLigjerata, totalEnrollments };
}

async function getStudente(ligjerataId, user) {
  const ligjerata = await prisma.ligjerata.findUnique({ where: { id: ligjerataId } });
  if (!ligjerata) throw new AppError('Ligjerata nuk u gjet', 404);
  if (ligjerata.profesorId !== user.id && user.role !== 'admin') {
    throw new AppError('Nuk keni leje', 403);
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { ligjerataId },
    include: {
      user: { select: { id: true, name: true, email: true, createdAt: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  return enrollments.map((e) => e.user);
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  enroll,
  unenroll,
  getMyEnrolled,
  getStatistika,
  getStudente,
};