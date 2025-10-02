import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { Request } from 'express';

/**
 * Configuração do Helmet para headers de segurança HTTP
 */
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com", "https://cdn.jsdelivr.net"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
    },
  },
});

/**
 * Rate Limiter para rotas de API geral
 * Previne ataques de força bruta e DoS
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requisições por IP
  message: {
    success: false,
    message: 'Muitas requisições deste IP. Tente novamente mais tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate Limiter mais restritivo para rotas de autenticação
 * Previne tentativas de força bruta em login
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Limite de 5 tentativas de login por IP
  message: {
    success: false,
    message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
  },
  skipSuccessfulRequests: true, // Não conta requisições bem-sucedidas
});

/**
 * Rate Limiter para formulário público de leads
 */
export const leadSubmissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // Máximo de 3 submissões por hora por IP
  message: {
    success: false,
    message: 'Você atingiu o limite de envios. Tente novamente mais tarde.',
  },
});

/**
 * Middleware para extrair IP real do cliente
 * Útil quando atrás de proxy (Vercel, CloudFlare, etc)
 */
export const getClientIp = (req: Request): string => {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' 
    ? forwarded.split(',')[0].trim() 
    : req.socket.remoteAddress || 'unknown';
  
  return ip;
};

