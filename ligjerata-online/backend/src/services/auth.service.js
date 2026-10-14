const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../db');
const config = require('../config');
const AppError = require('../utils/AppError');

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
}

async function register({ email, password, name, role }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError('Ky email është i regjistruar tashmë', 409);

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name, role: role || 'student' },
  });

  return {
    token: generateToken(user),
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  };
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError('Email ose password i gabuar', 401);

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AppError('Email ose password i gabuar', 401);

  return {
    token: generateToken(user),
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  };
}

async function getMe(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
  if (!user) throw new AppError('User nuk u gjet', 404);
  return user;
}

module.exports = { register, login, getMe, generateToken };