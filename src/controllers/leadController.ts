import { Request, Response, NextFunction } from 'express';
import { LeadService } from '../services/leadService';
import { CreateLeadDTO, AuthRequest } from '../types';
import { getClientIp } from '../middleware/securityMiddleware';

/**
 * Controller Layer - Camada HTTP
 * Responsabilidade: Receber requisições HTTP, delegar ao Service e retornar respostas
 */
export class LeadController {
  private leadService: LeadService;

  constructor() {
    this.leadService = new LeadService();
  }

  /**
   * POST /api/v1/leads
   * Cria um novo lead (formulário público)
   */
  createLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const leadData: CreateLeadDTO = {
        ...req.body,
        submissionInfo: {
          ipAddress: getClientIp(req),
          userAgent: req.headers['user-agent'] || '',
          referrer: req.headers['referer'] || req.headers['referrer'] || '',
        },
      };

      const lead = await this.leadService.createLead(leadData);

      res.status(201).json({
        success: true,
        message: 'Lead criado com sucesso!',
        data: lead,
      });
    } catch (error: any) {
      if (error.message === 'Email já cadastrado') {
        res.status(409).json({
          success: false,
          message: error.message,
        });
        return;
      }
      next(error);
    }
  };

  /**
   * POST /api/v1/leads/admin
   * Cria um novo lead pelo painel administrativo
   */
  createLeadAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const leadData: CreateLeadDTO = {
        ...req.body,
        submissionInfo: {
          ipAddress: getClientIp(req),
          userAgent: req.headers['user-agent'] || 'Admin Panel',
          referrer: 'Admin Panel',
          submittedAt: new Date().toISOString(),
        },
      };

      const lead = await this.leadService.createLead(leadData);

      res.status(201).json({
        success: true,
        message: 'Lead criado com sucesso!',
        data: lead,
      });
    } catch (error: any) {
      if (error.message === 'Email já cadastrado') {
        res.status(409).json({
          success: false,
          message: error.message,
        });
        return;
      }
      next(error);
    }
  };

  /**
   * GET /api/v1/admin/leads
   * Lista leads com paginação (rota protegida)
   */
  getLeads = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortBy = (req.query.sortBy as string) || 'createdAt';
      const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';
      const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
      const search = req.query.search as string;

      const result = await this.leadService.getLeads(
        { page, limit, sortBy, sortOrder },
        { isActive, search }
      );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/admin/leads/:id
   * Busca lead por ID (rota protegida)
   */
  getLeadById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const lead = await this.leadService.getLeadById(req.params.id);

      res.status(200).json({
        success: true,
        data: lead,
      });
    } catch (error: any) {
      if (error.message === 'Lead não encontrado') {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }
      next(error);
    }
  };

  /**
   * PUT /api/v1/admin/leads/:id
   * Atualiza lead (rota protegida)
   */
  updateLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const lead = await this.leadService.updateLead(req.params.id, req.body);

      res.status(200).json({
        success: true,
        message: 'Lead atualizado com sucesso!',
        data: lead,
      });
    } catch (error: any) {
      if (error.message === 'Lead não encontrado') {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }
      next(error);
    }
  };

  /**
   * DELETE /api/v1/admin/leads/:id
   * Desativa lead (soft delete) (rota protegida)
   */
  deactivateLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const lead = await this.leadService.deactivateLead(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Lead desativado com sucesso!',
        data: lead,
      });
    } catch (error: any) {
      if (error.message === 'Lead não encontrado') {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }
      next(error);
    }
  };

  /**
   * DELETE /api/v1/admin/leads/:id/permanent
   * Deleta permanentemente um lead (rota protegida)
   */
  deleteLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.leadService.deleteLead(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Lead deletado permanentemente!',
      });
    } catch (error: any) {
      if (error.message === 'Lead não encontrado') {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }
      next(error);
    }
  };

  /**
   * GET /api/v1/admin/leads/stats
   * Obtém estatísticas de leads (rota protegida)
   */
  getLeadStats = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this.leadService.getLeadStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  };
}

