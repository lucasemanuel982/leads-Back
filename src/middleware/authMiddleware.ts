import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthRequest } from '../types';

interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * Middleware para proteger rotas que requerem autenticação
 * Verifica o token JWT no header Authorization
 */
export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  let token: string | undefined;

  // 1. Checa se o token está no header (Authorization: Bearer <token>)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. Se não houver token, retorna erro de não autorizado
  if (!token) {
    res.status(401).json({ 
      success: false,
      message: 'Acesso negado. Token não fornecido.' 
    });
    return;
  }

  try {
    // 3. Verifica e decodifica o token
    const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;

    // 4. Adiciona o payload do usuário à requisição
    req.user = { 
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    // 5. Continua para o próximo middleware ou Controller
    next();
  } catch (error) {
    console.error('Erro na verificação do token:', error);
    res.status(401).json({ 
      success: false,
      message: 'Token inválido ou expirado.' 
    });
  }
};

/**
 * Middleware para verificar se o usuário tem permissão de admin
 */
export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ 
      success: false,
      message: 'Acesso negado. Apenas administradores.' 
    });
    return;
  }
  next();
};


