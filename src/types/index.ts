import { Request } from 'express';

// Request customizado com usuário autenticado
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
  };
}

// DTO para criação de Lead
export interface CreateLeadDTO {
  name: string;
  email: string;
  phone: string;
  position: string;
  birthDate: Date | string;
  message?: string;
  tracking?: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmTerm?: string;
    utmContent?: string;
    gclid?: string;
    fbclid?: string;
  };
  submissionInfo: {
    ipAddress: string;
    userAgent?: string;
    referrer?: string;
  };
}

// DTO para login
export interface LoginDTO {
  email: string;
  password: string;
}

// DTO para criar usuário
export interface CreateUserDTO {
  email: string;
  password: string;
  role?: string;
}

// Resposta padrão da API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Opções de paginação
export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Resposta paginada
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}


