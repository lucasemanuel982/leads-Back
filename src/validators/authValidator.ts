import Joi from 'joi';

// Validação para login
export const loginSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim().messages({
    'string.empty': 'O email é obrigatório',
    'string.email': 'Email inválido',
  }),
  
  password: Joi.string().min(6).required().messages({
    'string.empty': 'A senha é obrigatória',
    'string.min': 'A senha deve ter pelo menos 6 caracteres',
  }),
});

// Validação para criação de usuário
export const createUserSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim().messages({
    'string.empty': 'O email é obrigatório',
    'string.email': 'Email inválido',
  }),
  
  password: Joi.string().min(8).required().messages({
    'string.empty': 'A senha é obrigatória',
    'string.min': 'A senha deve ter pelo menos 8 caracteres',
  }),
  
  role: Joi.string().valid('admin', 'user').default('admin'),
});


