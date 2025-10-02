import Joi from 'joi';

// Validação para criação de Lead
export const createLeadSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().trim().messages({
    'string.empty': 'O nome é obrigatório',
    'string.min': 'O nome deve ter pelo menos 2 caracteres',
    'string.max': 'O nome não pode exceder 100 caracteres',
  }),
  
  email: Joi.string().email().required().lowercase().trim().messages({
    'string.empty': 'O email é obrigatório',
    'string.email': 'Email inválido',
  }),
  
  phone: Joi.string().min(10).max(20).required().trim().messages({
    'string.empty': 'O telefone é obrigatório',
    'string.min': 'O telefone deve ter pelo menos 10 caracteres',
  }),
  
  position: Joi.string().min(2).max(100).required().trim().messages({
    'string.empty': 'O cargo é obrigatório',
  }),
  
  birthDate: Joi.date().max('now').required().messages({
    'date.base': 'Data de nascimento inválida',
    'date.max': 'Data de nascimento não pode ser no futuro',
  }),
  
  message: Joi.string().max(1000).allow('').trim(),
  
  tracking: Joi.object({
    utmSource: Joi.string().allow(null, ''),
    utmMedium: Joi.string().allow(null, ''),
    utmCampaign: Joi.string().allow(null, ''),
    utmTerm: Joi.string().allow(null, ''),
    utmContent: Joi.string().allow(null, ''),
    gclid: Joi.string().allow(null, ''),
    fbclid: Joi.string().allow(null, ''),
  }).optional(),
  
  submissionInfo: Joi.object({
    ipAddress: Joi.string().allow('').required(),
    userAgent: Joi.string().allow(''),
    referrer: Joi.string().allow(''),
  }).required(),
});

// Validação para criação de Lead pelo Admin (sem submissionInfo obrigatório)
export const createLeadAdminSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().trim().messages({
    'string.empty': 'O nome é obrigatório',
    'string.min': 'O nome deve ter pelo menos 2 caracteres',
    'string.max': 'O nome não pode exceder 100 caracteres',
  }),
  
  email: Joi.string().email().required().lowercase().trim().messages({
    'string.empty': 'O email é obrigatório',
    'string.email': 'Email inválido',
  }),
  
  phone: Joi.string().min(10).max(20).required().trim().messages({
    'string.empty': 'O telefone é obrigatório',
    'string.min': 'O telefone deve ter pelo menos 10 caracteres',
  }),
  
  position: Joi.string().min(2).max(100).required().trim().messages({
    'string.empty': 'O cargo é obrigatório',
  }),
  
  birthDate: Joi.date().max('now').required().messages({
    'date.base': 'Data de nascimento inválida',
    'date.max': 'Data de nascimento não pode ser no futuro',
  }),
  
  message: Joi.string().max(1000).allow('').trim(),
  
  tracking: Joi.object({
    utmSource: Joi.string().allow(null, ''),
    utmMedium: Joi.string().allow(null, ''),
    utmCampaign: Joi.string().allow(null, ''),
    utmTerm: Joi.string().allow(null, ''),
    utmContent: Joi.string().allow(null, ''),
    gclid: Joi.string().allow(null, ''),
    fbclid: Joi.string().allow(null, ''),
  }).optional(),
  
  submissionInfo: Joi.object({
    ipAddress: Joi.string().allow(''),
    userAgent: Joi.string().allow(''),
    referrer: Joi.string().allow(''),
  }).optional(),
});

// Validação para atualização de Lead
export const updateLeadSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim(),
  email: Joi.string().email().lowercase().trim(),
  phone: Joi.string().min(10).max(20).trim(),
  position: Joi.string().min(2).max(100).trim(),
  birthDate: Joi.date().max('now'),
  message: Joi.string().max(1000).allow('').trim(),
  isActive: Joi.boolean(),
}).min(1); // Pelo menos um campo deve ser fornecido


