import { Lead, ILead } from '../models/Lead';
import { CreateLeadDTO, PaginationOptions } from '../types';

/**
 * Repository Pattern - Camada de Acesso aos Dados
 * Responsabilidade única: Interagir com o banco de dados (SRP)
 */
export class LeadRepository {
  /**
   * Cria um novo lead
   */
  async create(leadData: CreateLeadDTO): Promise<ILead> {
    const lead = new Lead(leadData);
    return await lead.save();
  }

  /**
   * Busca um lead por ID
   */
  async findById(id: string): Promise<ILead | null> {
    return await Lead.findById(id);
  }

  /**
   * Busca um lead por email
   */
  async findByEmail(email: string): Promise<ILead | null> {
    return await Lead.findOne({ email: email.toLowerCase() });
  }

  /**
   * Lista todos os leads com paginação e filtros
   */
  async findAll(options: PaginationOptions, filters: any = {}): Promise<{
    leads: ILead[];
    total: number;
  }> {
    const { page, limit, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;

    const query = { ...filters };
    const sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [leads, total] = await Promise.all([
      Lead.find(query).sort(sort).skip(skip).limit(limit),
      Lead.countDocuments(query),
    ]);

    return { leads, total };
  }

  /**
   * Atualiza um lead por ID
   */
  async updateById(id: string, updateData: Partial<ILead>): Promise<ILead | null> {
    return await Lead.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  /**
   * Deleta (soft delete) um lead por ID
   */
  async softDeleteById(id: string): Promise<ILead | null> {
    return await Lead.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true }
    );
  }

  /**
   * Deleta permanentemente um lead por ID
   */
  async deleteById(id: string): Promise<ILead | null> {
    return await Lead.findByIdAndDelete(id);
  }

  /**
   * Verifica se um email já existe
   */
  async emailExists(email: string, excludeId?: string): Promise<boolean> {
    const query: any = { email: email.toLowerCase() };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const count = await Lead.countDocuments(query);
    return count > 0;
  }

  /**
   * Estatísticas gerais de leads
   */
  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    thisMonth: number;
  }> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, active, thisMonth] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ isActive: true }),
      Lead.countDocuments({ createdAt: { $gte: startOfMonth } }),
    ]);

    return {
      total,
      active,
      inactive: total - active,
      thisMonth,
    };
  }
}


