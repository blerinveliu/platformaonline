const { z } = require('zod');

const registerSchema = z.object({
  email: z.string().email('Email i pavlefshëm'),
  password: z.string().min(6, 'Fjalëkalimi duhet të ketë të paktën 6 karaktere'),
  name: z.string().min(2, 'Emri duhet të ketë të paktën 2 karaktere'),
  role: z.enum(['student', 'profesor', 'admin']).optional(),
});

const loginSchema = z.object({
  email: z.string().email('Email i pavlefshëm'),
  password: z.string().min(1, 'Fjalëkalimi është i detyrueshëm'),
});

module.exports = { registerSchema, loginSchema };