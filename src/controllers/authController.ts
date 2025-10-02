import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { LoginDTO, CreateUserDTO, AuthRequest } from '../types';

/**
 * Controller Layer - Autenticação
 */
export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * POST /api/v1/auth/login
   * Realiza login
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const loginData: LoginDTO = req.body;
      const result = await this.authService.login(loginData);

      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso!',
        data: result,
      });
    } catch (error: any) {
      if (error.message === 'Credenciais inválidas') {
        res.status(401).json({
          success: false,
          message: error.message,
        });
        return;
      }
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/register
   * Cria um novo usuário (rota protegida - apenas admins podem criar outros admins)
   */
  register = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDTO = req.body;
      const user = await this.authService.createUser(userData);

      res.status(201).json({
        success: true,
        message: 'Usuário criado com sucesso!',
        data: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
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
   * GET /api/v1/auth/me
   * Retorna dados do usuário autenticado
   */
  getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Não autenticado',
        });
        return;
      }

      const user = await this.authService.getUserById(req.user.id);

      res.status(200).json({
        success: true,
        data: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/auth/users
   * Lista todos os usuários (apenas admins)
   */
  getUsers = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.authService.getAllUsers();

      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  };
}

