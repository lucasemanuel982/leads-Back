import { Request, Response } from 'express';
import { completeSwaggerSpec } from '../config/swaggerComplete';

/**
 * Implementação completamente customizada do Swagger UI
 * Não usa swagger-ui-express para evitar problemas de MIME type no Vercel
 */
export const serveSwaggerUI = (_req: Request, res: Response): void => {
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API de Leads - Documentação</title>
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui.css" />
  <style>
    .swagger-ui .topbar { display: none !important; }
    .swagger-ui .info .title { color: #3b82f6; }
    body { margin: 0; padding: 0; }
    .loading { text-align: center; padding: 50px; }
  </style>
</head>
<body>
  <div id="swagger-ui">
    <div class="loading">
      <h2>Carregando documentação da API...</h2>
      <p>Aguarde enquanto carregamos o Swagger UI.</p>
    </div>
  </div>
  
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
  
  <script>
    // Função para inicializar o Swagger UI
    function initSwaggerUI() {
      // Verifica se as bibliotecas foram carregadas
      if (typeof SwaggerUIBundle === 'undefined') {
        document.getElementById('swagger-ui').innerHTML = 
          '<div style="padding: 20px; color: red; text-align: center;">' +
          '<h2>Erro ao carregar Swagger UI</h2>' +
          '<p>As bibliotecas do Swagger UI não foram carregadas corretamente.</p>' +
          '<p>Verifique sua conexão com a internet e tente novamente.</p>' +
          '</div>';
        return;
      }
      
      try {
        // Inicializa o Swagger UI
        const ui = SwaggerUIBundle({
          url: '/api/v1/swagger.json',
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
          ],
          plugins: [
            SwaggerUIBundle.plugins.DownloadUrl
          ],
          layout: "StandaloneLayout",
          persistAuthorization: true,
          displayRequestDuration: true,
          docExpansion: 'none',
          filter: true,
          showExtensions: true,
          showCommonExtensions: true,
          tryItOutEnabled: true,
          requestInterceptor: function(req) {
            // Adiciona headers CORS
            req.headers['Access-Control-Allow-Origin'] = '*';
            req.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
            req.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
            return req;
          },
          onComplete: function() {
            console.log('✅ Swagger UI carregado com sucesso');
          },
          onFailure: function(error) {
            console.error('❌ Erro ao carregar Swagger UI:', error);
            document.getElementById('swagger-ui').innerHTML = 
              '<div style="padding: 20px; color: red; text-align: center;">' +
              '<h2>Erro ao carregar documentação</h2>' +
              '<p>Erro: ' + error.message + '</p>' +
              '</div>';
          }
        });
        
        console.log('🚀 Swagger UI inicializado');
        
      } catch (error) {
        console.error('❌ Erro ao inicializar Swagger UI:', error);
        document.getElementById('swagger-ui').innerHTML = 
          '<div style="padding: 20px; color: red; text-align: center;">' +
          '<h2>Erro ao inicializar Swagger UI</h2>' +
          '<p>Erro: ' + error.message + '</p>' +
          '</div>';
      }
    }
    
    // Aguarda o DOM estar pronto
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initSwaggerUI);
    } else {
      initSwaggerUI();
    }
  </script>
</body>
</html>`;
  
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.send(html);
};

/**
 * Rota para servir o JSON do Swagger
 */
export const serveSwaggerJSON = (_req: Request, res: Response): void => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.json(completeSwaggerSpec);
};

/**
 * Rota de debug para verificar o JSON do Swagger
 */
export const serveSwaggerDebug = (_req: Request, res: Response): void => {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    isVercel: process.env.VERCEL === '1',
    swaggerSpec: {
      info: (completeSwaggerSpec as any).info,
      paths: Object.keys(completeSwaggerSpec.paths || {}),
      components: Object.keys((completeSwaggerSpec as any).components || {}),
    },
    totalPaths: Object.keys(completeSwaggerSpec.paths || {}).length,
    totalSchemas: Object.keys((completeSwaggerSpec as any).components?.schemas || {}).length,
  };
  
  res.setHeader('Content-Type', 'application/json');
  res.json(debugInfo);
};