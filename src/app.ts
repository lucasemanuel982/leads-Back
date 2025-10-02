import express, { Application } from 'express';
import cors from 'cors';
import compression from 'compression';
import { env } from './config/env';
import { helmetConfig, apiLimiter } from './middleware/securityMiddleware';
import { errorHandler, notFound } from './middleware/errorMiddleware';
import { serveSwaggerUI, serveSwaggerDebug } from './routes/swaggerRoutes';
import routes from './routes';

/**
 * Configuração da aplicação Express
 */
export const createApp = (): Application => {
  const app = express();

  // Middlewares de segurança
  app.use(helmetConfig);
  
  // CORS
  app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }));

  // Compressão de respostas
  app.use(compression());

  // Body parser
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Rate limiting global
  app.use('/api/', apiLimiter);

  // Documentação Swagger personalizada para Vercel
  app.get('/docs', serveSwaggerUI);
  app.get('/docs/', serveSwaggerUI);
  app.get('/swagger-debug', serveSwaggerDebug);

  // Rotas principais
  app.use('/api/v1', routes);

  // Rota raiz
  app.get('/', (_req, res) => {
    res.json({
      success: true,
      message: 'API de Gerenciamento de Leads',
      version: '1.0.0',
      documentation: '/docs',
      endpoints: {
        health: '/api/v1/health',
        leads: '/api/v1/leads',
        auth: '/api/v1/auth',
      },
    });
  });

  // Tratamento de erros
  app.use(notFound); // 404
  app.use(errorHandler); // Erro global

  return app;
};

