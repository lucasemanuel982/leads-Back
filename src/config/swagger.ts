import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

// Determina o caminho correto baseado no ambiente
const getApiPaths = () => {
  // Sempre usa os arquivos TypeScript, mesmo em produção
  // O swagger-jsdoc consegue ler os comentários JSDoc dos arquivos .ts
  return ['./src/routes/*.ts'];
};

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gerenciamento de Leads',
      version: '1.0.0',
      description: 'API RESTful para gerenciamento de leads com autenticação JWT',
      contact: {
        name: 'Sistema de Leads',
        email: 'admin@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}/api/v1`,
        description: 'Servidor de Desenvolvimento',
      },
      {
        url: `${env.API_URL}/api/v1`,
        description: 'Servidor de Produção',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT para autenticação',
        },
      },
      schemas: {
        // Schemas de Autenticação
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'admin@example.com',
              description: 'Email do usuário',
            },
            password: {
              type: 'string',
              minLength: 6,
              example: '123456',
              description: 'Senha do usuário',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Login realizado com sucesso',
            },
            data: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
                user: {
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'admin@example.com',
            },
            role: {
              type: 'string',
              enum: ['admin', 'user'],
              example: 'admin',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-12-01T10:00:00.000Z',
            },
          },
        },
        // Schemas de Leads
        Lead: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              example: 'João Silva',
              description: 'Nome completo do lead',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'joao@example.com',
            },
            phone: {
              type: 'string',
              example: '(11) 99999-9999',
            },
            position: {
              type: 'string',
              example: 'Desenvolvedor',
            },
            birthDate: {
              type: 'string',
              format: 'date',
              example: '1990-01-01',
            },
            message: {
              type: 'string',
              example: 'Interessado em conhecer mais sobre o produto',
            },
            isActive: {
              type: 'boolean',
              example: true,
            },
            tracking: {
              $ref: '#/components/schemas/Tracking',
            },
            submissionInfo: {
              $ref: '#/components/schemas/SubmissionInfo',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-12-01T10:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-12-01T10:00:00.000Z',
            },
          },
        },
        LeadCreateRequest: {
          type: 'object',
          required: ['name', 'email', 'phone', 'position', 'birthDate'],
          properties: {
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              example: 'João Silva',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'joao@example.com',
            },
            phone: {
              type: 'string',
              pattern: '^\\([0-9]{2}\\) [0-9]{4,5}-[0-9]{4}$',
              example: '(11) 99999-9999',
            },
            position: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              example: 'Desenvolvedor',
            },
            birthDate: {
              type: 'string',
              format: 'date',
              example: '1990-01-01',
            },
            message: {
              type: 'string',
              maxLength: 500,
              example: 'Interessado em conhecer mais sobre o produto',
            },
          },
        },
        LeadUpdateRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              example: 'João Silva Santos',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'joao.santos@example.com',
            },
            phone: {
              type: 'string',
              pattern: '^\\([0-9]{2}\\) [0-9]{4,5}-[0-9]{4}$',
              example: '(11) 88888-8888',
            },
            position: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              example: 'Desenvolvedor Senior',
            },
            birthDate: {
              type: 'string',
              format: 'date',
              example: '1985-01-01',
            },
            message: {
              type: 'string',
              maxLength: 500,
              example: 'Atualizado: Interessado em conhecer mais sobre o produto',
            },
            isActive: {
              type: 'boolean',
              example: true,
            },
          },
        },
        Tracking: {
          type: 'object',
          properties: {
            utmSource: {
              type: 'string',
              example: 'google',
            },
            utmMedium: {
              type: 'string',
              example: 'cpc',
            },
            utmCampaign: {
              type: 'string',
              example: 'summer_sale',
            },
            utmTerm: {
              type: 'string',
              example: 'leads',
            },
            utmContent: {
              type: 'string',
              example: 'banner_top',
            },
            gclid: {
              type: 'string',
              example: 'Cj0KCQiA...',
            },
            fbclid: {
              type: 'string',
              example: 'IwAR...',
            },
          },
        },
        SubmissionInfo: {
          type: 'object',
          properties: {
            ipAddress: {
              type: 'string',
              example: '192.168.1.1',
            },
            userAgent: {
              type: 'string',
              example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
            referrer: {
              type: 'string',
              example: 'https://google.com',
            },
            submittedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-12-01T10:00:00.000Z',
            },
          },
        },
        LeadStats: {
          type: 'object',
          properties: {
            total: {
              type: 'number',
              example: 150,
              description: 'Total de leads',
            },
            active: {
              type: 'number',
              example: 120,
              description: 'Leads ativos',
            },
            inactive: {
              type: 'number',
              example: 30,
              description: 'Leads inativos',
            },
            thisMonth: {
              type: 'number',
              example: 25,
              description: 'Leads criados este mês',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Erro interno do servidor',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    example: 'email',
                  },
                  message: {
                    type: 'string',
                    example: 'Email é obrigatório',
                  },
                },
              },
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Operação realizada com sucesso',
            },
            data: {
              type: 'object',
              description: 'Dados retornados pela operação',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: getApiPaths(),
};

export const swaggerSpec = swaggerJsdoc(options);
