import { User, IUser } from '../models/User';
import { CreateUserDTO } from '../types';

/**
 * Repository Pattern - Camada de Acesso aos Dados para Users
 */
export class UserRepository {
  /**
   * Cria um novo usuário
   */
  async create(userData: CreateUserDTO): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  /**
   * Busca um usuário por ID
   */
  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id).select('-password');
  }

  /**
   * Busca um usuário por email (incluindo senha para autenticação)
   */
  async findByEmail(email: string, includePassword = false): Promise<IUser | null> {
    const query = User.findOne({ email: email.toLowerCase() });
    if (!includePassword) {
      query.select('-password');
    }
    return await query;
  }

  /**
   * Verifica se um email já está em uso
   */
  async emailExists(email: string, excludeId?: string): Promise<boolean> {
    const query: any = { email: email.toLowerCase() };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const count = await User.countDocuments(query);
    return count > 0;
  }

  /**
   * Lista todos os usuários
   */
  async findAll(): Promise<IUser[]> {
    return await User.find().select('-password');
  }

  /**
   * Atualiza um usuário por ID
   */
  async updateById(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');
  }

  /**
   * Deleta um usuário por ID
   */
  async deleteById(id: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(id);
  }
}


