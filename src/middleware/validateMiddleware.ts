import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

/**
 * Middleware genérico para validação com Joi
 * Aplica o princípio SRP (Single Responsibility Principle)
 */
export const validate = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Retorna todos os erros, não apenas o primeiro
      stripUnknown: true, // Remove campos desconhecidos
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      res.status(400).json({
        success: false,
        message: 'Erro de validação',
        errors,
      });
      return;
    }

    // Substitui req.body pelos dados validados e sanitizados
    req.body = value;
    next();
  };
};


