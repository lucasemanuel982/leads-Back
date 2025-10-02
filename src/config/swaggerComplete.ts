import { swaggerSpec } from './swagger';

/**
 * Especificação Swagger completa com todos os endpoints
 * Esta versão funciona tanto em desenvolvimento quanto em produção
 */
export const completeSwaggerSpec = {
  ...swaggerSpec,
  paths: {
    // Endpoints de Autenticação
    '/api/v1/auth/login': {
      post: {
        summary: 'Realizar login',
        description: 'Autentica um usuário e retorna um token JWT',
        tags: ['Autenticação'],
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginRequest'
              },
              example: {
                email: 'admin@example.com',
                password: '123456'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Login realizado com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoginResponse'
                }
              }
            }
          },
          '400': {
            description: 'Dados inválidos',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '401': {
            description: 'Credenciais inválidas',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/auth/me': {
      get: {
        summary: 'Obter dados do usuário logado',
        description: 'Retorna os dados do usuário autenticado',
        tags: ['Autenticação'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Dados do usuário',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Usuário obtido com sucesso' },
                    data: {
                      $ref: '#/components/schemas/User'
                    }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Token inválido ou expirado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/auth/users': {
      post: {
        summary: 'Criar usuário (Admin)',
        description: 'Cria um novo usuário (apenas administradores)',
        tags: ['Autenticação'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateUserRequest'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Usuário criado com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Success'
                }
              }
            }
          },
          '400': {
            description: 'Dados inválidos',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '401': {
            description: 'Token inválido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '403': {
            description: 'Acesso negado - apenas administradores',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    
    // Endpoints de Leads
    '/api/v1/leads': {
      post: {
        summary: 'Criar lead (formulário público)',
        description: 'Cria um novo lead através do formulário público com tracking automático',
        tags: ['Leads'],
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LeadCreateRequest'
              },
              example: {
                name: 'João Silva',
                email: 'joao@example.com',
                phone: '(11) 99999-9999',
                position: 'Desenvolvedor',
                birthDate: '1990-01-01',
                message: 'Interessado em conhecer mais sobre o produto'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Lead criado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Lead criado com sucesso' },
                    data: {
                      $ref: '#/components/schemas/Lead'
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Dados inválidos',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      },
      get: {
        summary: 'Listar leads',
        description: 'Lista todos os leads com paginação e filtros',
        tags: ['Leads'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Número da página',
            schema: { type: 'integer', minimum: 1, default: 1 }
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Itens por página',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
          },
          {
            name: 'search',
            in: 'query',
            description: 'Termo de busca',
            schema: { type: 'string' }
          },
          {
            name: 'isActive',
            in: 'query',
            description: 'Filtrar por status ativo',
            schema: { type: 'boolean' }
          }
        ],
        responses: {
          '200': {
            description: 'Lista de leads',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Leads obtidos com sucesso' },
                    data: {
                      type: 'object',
                      properties: {
                        leads: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Lead' }
                        },
                        pagination: {
                          type: 'object',
                          properties: {
                            page: { type: 'integer', example: 1 },
                            limit: { type: 'integer', example: 10 },
                            total: { type: 'integer', example: 50 },
                            pages: { type: 'integer', example: 5 }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Token inválido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/leads/{id}': {
      get: {
        summary: 'Obter lead por ID',
        description: 'Retorna os dados de um lead específico',
        tags: ['Leads'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID do lead',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Lead encontrado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Lead obtido com sucesso' },
                    data: {
                      $ref: '#/components/schemas/Lead'
                    }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Token inválido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '404': {
            description: 'Lead não encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      },
      put: {
        summary: 'Atualizar lead',
        description: 'Atualiza os dados de um lead existente',
        tags: ['Leads'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID do lead',
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LeadUpdateRequest'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Lead atualizado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Lead atualizado com sucesso' },
                    data: {
                      $ref: '#/components/schemas/Lead'
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Dados inválidos',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '401': {
            description: 'Token inválido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '404': {
            description: 'Lead não encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      },
      delete: {
        summary: 'Excluir lead',
        description: 'Remove um lead do sistema',
        tags: ['Leads'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID do lead',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Lead excluído com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Success'
                }
              }
            }
          },
          '401': {
            description: 'Token inválido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '404': {
            description: 'Lead não encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/leads/admin/create': {
      post: {
        summary: 'Criar lead (Admin)',
        description: 'Cria um novo lead através do painel administrativo',
        tags: ['Leads'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateLeadAdminRequest'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Lead criado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Lead criado com sucesso' },
                    data: {
                      $ref: '#/components/schemas/Lead'
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Dados inválidos',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '401': {
            description: 'Token inválido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '403': {
            description: 'Acesso negado - apenas administradores',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/leads/stats': {
      get: {
        summary: 'Estatísticas de leads',
        description: 'Retorna estatísticas gerais dos leads',
        tags: ['Leads'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Estatísticas obtidas com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Estatísticas obtidas com sucesso' },
                    data: {
                      $ref: '#/components/schemas/LeadStats'
                    }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Token inválido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/leads/export': {
      get: {
        summary: 'Exportar leads',
        description: 'Exporta todos os leads em formato CSV',
        tags: ['Leads'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Arquivo CSV gerado com sucesso',
            content: {
              'text/csv': {
                schema: {
                  type: 'string',
                  format: 'binary'
                }
              }
            }
          },
          '401': {
            description: 'Token inválido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    
    // Endpoints do Sistema
    '/api/v1/health': {
      get: {
        summary: 'Health Check',
        description: 'Verifica se a API está funcionando corretamente',
        tags: ['Sistema'],
        security: [],
        responses: {
          '200': {
            description: 'API funcionando corretamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'API está funcionando!' },
                    timestamp: { type: 'string', format: 'date-time', example: '2023-12-01T10:00:00.000Z' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
