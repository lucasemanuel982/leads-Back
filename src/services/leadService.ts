import { LeadRepository } from '../repositories/leadRepository';
import { CreateLeadDTO, PaginationOptions, PaginatedResponse } from '../types';
import { ILead } from '../models/Lead';

/**
 * Service Layer - Lógica de Negócio
 * Aplica princípios SOLID: SRP (Single Responsibility) e DIP (Dependency Inversion)
 */
export class LeadService {
  private leadRepository: LeadRepository;

  constructor() {
    this.leadRepository = new LeadRepository();
  }

  /**
   * Cria um novo lead com validações de negócio
   */
  async createLead(leadData: CreateLeadDTO): Promise<ILead> {
    // Validação de negócio: verificar se email já existe
    const emailExists = await this.leadRepository.emailExists(leadData.email);
    if (emailExists) {
      throw new Error('Email já cadastrado');
    }

    // Validação de negócio: verificar idade mínima (opcional)
    const birthDate = new Date(leadData.birthDate);
    const age = this.calculateAge(birthDate);
    if (age < 18) {
      throw new Error('É necessário ter 18 anos ou mais');
    }

    return await this.leadRepository.create(leadData);
  }

  /**
   * Busca um lead por ID
   */
  async getLeadById(id: string): Promise<ILead> {
    const lead = await this.leadRepository.findById(id);
    if (!lead) {
      throw new Error('Lead não encontrado');
    }
    return lead;
  }

  /**
   * Lista leads com paginação e filtros
   */
  async getLeads(
    options: PaginationOptions,
    filters: { isActive?: boolean; search?: string } = {}
  ): Promise<PaginatedResponse<ILead>> {
    const query: any = {};

    // Filtro por status ativo/inativo
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    // Busca por nome ou email
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const { leads, total } = await this.leadRepository.findAll(options, query);

    return {
      data: leads,
      pagination: {
        currentPage: options.page,
        totalPages: Math.ceil(total / options.limit),
        totalItems: total,
        itemsPerPage: options.limit,
      },
    };
  }

  /**
   * Atualiza um lead
   */
  async updateLead(id: string, updateData: Partial<ILead>): Promise<ILead> {
    // Se está atualizando o email, verifica se já existe
    if (updateData.email) {
      const emailExists = await this.leadRepository.emailExists(updateData.email, id);
      if (emailExists) {
        throw new Error('Email já cadastrado para outro lead');
      }
    }

    const updatedLead = await this.leadRepository.updateById(id, updateData);
    if (!updatedLead) {
      throw new Error('Lead não encontrado');
    }

    return updatedLead;
  }

  /**
   * Desativa um lead (soft delete)
   */
  async deactivateLead(id: string): Promise<ILead> {
    const lead = await this.leadRepository.softDeleteById(id);
    if (!lead) {
      throw new Error('Lead não encontrado');
    }
    return lead;
  }

  /**
   * Deleta permanentemente um lead
   */
  async deleteLead(id: string): Promise<void> {
    const lead = await this.leadRepository.deleteById(id);
    if (!lead) {
      throw new Error('Lead não encontrado');
    }
  }

  /**
   * Obtém estatísticas de leads
   */
  async getLeadStats() {
    return await this.leadRepository.getStats();
  }

  /**
   * Calcula idade a partir da data de nascimento
   */
  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}


