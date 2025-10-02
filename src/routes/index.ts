import { Router } from 'express';
import leadRoutes from './leadRoutes';
import authRoutes from './authRoutes';
import { serveSwaggerJSON } from './swaggerRoutes';

const router = Router();

/**
 * Rotas principais da API v1
 */
router.use('/leads', leadRoutes);
router.use('/auth', authRoutes);

/**
 * @swagger
 * /swagger.json:
 *   get:
 *     summary: Swagger JSON
 *     description: Retorna a especificação OpenAPI em formato JSON
 *     tags: [Documentação]
 *     security: []
 *     responses:
 *       200:
 *         description: Especificação OpenAPI
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/swagger.json', serveSwaggerJSON);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health Check
 *     description: Verifica se a API está funcionando corretamente
 *     tags: [Sistema]
 *     security: []
 *     responses:
 *       200:
 *         description: API funcionando corretamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: API está funcionando!
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2023-12-01T10:00:00.000Z
 */
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'API está funcionando!',
    timestamp: new Date().toISOString(),
  });
});

export default router;

