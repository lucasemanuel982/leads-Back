import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/userRepository';
import { LoginDTO, CreateUserDTO } from '../types';
import { env } from '../config/env';
import { IUser } from '../models/User';

/**
 * Service Layer - Lógica de Negócio para Autenticação
 */
export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Realiza login e retorna token JWT
   */
  async login(loginData: LoginDTO): Promise<{ token: string; user: Partial<IUser> }> {
    const { email, password } = loginData;

    // Busca usuário com senha incluída
    const user = await this.userRepository.findByEmail(email, true);
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    // Verifica senha
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }

    // Gera token JWT
    const token = this.generateToken(user);

    // Retorna token e dados do usuário (sem senha)
    return {
      token,
      user: {
        id: (user._id as any).toString(),
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * Cria um novo usuário admin
   */
  async createUser(userData: CreateUserDTO): Promise<IUser> {
    // Verifica se email já existe
    const emailExists = await this.userRepository.emailExists(userData.email);
    if (emailExists) {
      throw new Error('Email já cadastrado');
    }

    // Cria o usuário (a senha será hasheada automaticamente no model)
    return await this.userRepository.create(userData);
  }

  /**
   * Verifica token e retorna dados do usuário
   */
  async verifyToken(token: string): Promise<Partial<IUser>> {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
      const user = await this.userRepository.findById(decoded.id);
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return {
        id: (user._id as any).toString(),
        email: user.email,
        role: user.role,
      };
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }

  /**
   * Gera token JWT
   */
  private generateToken(user: IUser): string {
    const payload = {
      id: (user._id as any).toString(),
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, env.JWT_SECRET as string, { expiresIn: '7d' });
  }

  /**
   * Lista todos os usuários (apenas admins)
   */
  async getAllUsers(): Promise<IUser[]> {
    return await this.userRepository.findAll();
  }

  /**
   * Busca usuário por ID
   */
  async getUserById(id: string): Promise<IUser> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    return user;
  }
}

