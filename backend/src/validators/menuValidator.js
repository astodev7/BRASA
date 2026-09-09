const { z } = require('zod');

const menuItemSchema = z.object({
  category_id: z.number({ invalid_type_error: 'Selecione uma categoria.' }).int().positive(),
  name: z.string().trim().min(2).max(150),
  description: z.string().trim().max(1000).optional().or(z.literal('')),
  price: z.number({ invalid_type_error: 'Informe um preco valido.' }).positive('O preco deve ser maior que zero.'),
  image_url: z.string().trim().url('Informe uma URL de imagem valida.').optional().or(z.literal('')),
  ingredients: z.array(z.string().trim()).optional().default([]),
  allergens: z.array(z.string().trim()).optional().default([]),
  available: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false),
  display_order: z.number().int().optional().default(0),
});

const menuItemUpdateSchema = menuItemSchema.partial();

const categorySchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(500).optional().or(z.literal('')),
  display_order: z.number().int().optional().default(0),
  active: z.boolean().optional().default(true),
});

const categoryUpdateSchema = categorySchema.partial();

module.exports = { menuItemSchema, menuItemUpdateSchema, categorySchema, categoryUpdateSchema };
