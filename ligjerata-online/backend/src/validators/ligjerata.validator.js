const { z } = require('zod');

const ligjerataSchema = z.object({
  titull: z.string().min(3, 'Titulli duhet të ketë të paktën 3 karaktere'),
  pershkrim: z.string().optional(),
  videoUrl: z.string().url('URL e pavlefshme'),
  kategori: z.string().optional(),
});

const ligjerataUpdateSchema = ligjerataSchema.partial();

module.exports = { ligjerataSchema, ligjerataUpdateSchema };