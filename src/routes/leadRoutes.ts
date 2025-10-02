import { Router } from 'express';
import { LeadController } from '../controllers/leadController';
import { validate } from '../middleware/validateMiddleware';
import { protect, adminOnly } from '../middleware/authMiddleware';
import { createLeadSchema, updateLeadSchema, createLeadAdminSchema } from '../validators/leadValidator';
import { leadSubmissionLimiter } from '../middleware/securityMiddleware';

const router = Router();
const leadController = new LeadController();

/**
 * @swagger
 * tags:
 *   name: Leads
 *   description: Endpoints para gerenciamento de leads
 */

/**
 * @swagger
 * /leads:
 *   post:
 *     summary: Criar lead (formulário público)
 *     description: Cria um novo lead através do formulário público com tracking automático
 *     tags: [Leads]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LeadCreateRequest'
 *           example:
 *             name: "João Silva"
 *             email: "joao@example.com"
 *             phone: "(11) 99999-9999"
 *             position: "Desenvolvedor"
 *             birthDate: "1990-01-01"
 *             message: "Interessado em conhecer mais sobre o produto"
 *     responses:
 *       201:
 *         description: Lead criado com sucesso
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
 *                   example: Lead criado com sucesso
 *                 data:
 *                   $ref: '#/components/schemas/Lead'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       429:
 *         description: Muitas submissões (rate limit)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/',
  leadSubmissionLimiter, // Rate limiting específico para formulário
  validate(createLeadSchema), // Validação com Joi
  leadController.createLead
);

/**
 * Rotas protegidas de administração (requerem autenticação)
 */
router.use('/admin', protect); // Todas as rotas abaixo requerem autenticação

/**
 * @swagger
 * /leads/admin:
 *   post:
 *     summary: Criar lead (administração)
 *     description: Cria um novo lead através do painel administrativo
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LeadCreateRequest'
 *     responses:
 *       201:
 *         description: Lead criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Lead'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token não fornecido ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/admin',
  validate(createLeadAdminSchema),
  leadController.createLeadAdmin
);

/**
 * @swagger
 * /leads/admin:
 *   get:
 *     summary: Listar leads
 *     description: Retorna uma lista paginada de leads com filtros de busca
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Número de itens por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Termo de busca (nome ou email)
 *     responses:
 *       200:
 *         description: Lista de leads obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Lead'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 50
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *       401:
 *         description: Token não fornecido ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/admin', leadController.getLeads);

/**
 * @swagger
 * /leads/admin/stats:
 *   get:
 *     summary: Obter estatísticas de leads
 *     description: Retorna estatísticas gerais dos leads (total, ativos, inativos, este mês)
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas obtidas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/LeadStats'
 *       401:
 *         description: Token não fornecido ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/admin/stats', leadController.getLeadStats);

/**
 * @swagger
 * /leads/admin/{id}:
 *   get:
 *     summary: Obter lead por ID
 *     description: Retorna os detalhes completos de um lead específico
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do lead
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Lead obtido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Lead'
 *       401:
 *         description: Token não fornecido ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Lead não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/admin/:id', leadController.getLeadById);

/**
 * @swagger
 * /leads/admin/{id}:
 *   put:
 *     summary: Atualizar lead
 *     description: Atualiza os dados de um lead existente
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do lead
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LeadUpdateRequest'
 *     responses:
 *       200:
 *         description: Lead atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Lead'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token não fornecido ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Lead não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
  '/admin/:id',
  validate(updateLeadSchema),
  leadController.updateLead
);

/**
 * @swagger
 * /leads/admin/{id}:
 *   delete:
 *     summary: Desativar lead
 *     description: Desativa um lead (soft delete) - não remove permanentemente do banco
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do lead
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Lead desativado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         description: Token não fornecido ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Lead não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/admin/:id', leadController.deactivateLead);

/**
 * @swagger
 * /leads/admin/{id}/permanent:
 *   delete:
 *     summary: Excluir lead permanentemente
 *     description: Remove permanentemente um lead do banco de dados (apenas administradores)
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do lead
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Lead excluído permanentemente com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         description: Token não fornecido ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acesso negado - apenas administradores
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Lead não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/admin/:id/permanent', adminOnly, leadController.deleteLead);

export default router;


