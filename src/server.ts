import { createApp } from './app';
import { connectDatabase } from './config/database';
import { env } from './config/env';

// Cria a aplicação Express
const app = createApp();

// Conecta ao MongoDB
connectDatabase().catch((error) => {
  console.error('❌ Erro ao conectar ao banco de dados:', error);
});

// Exporta a aplicação para o Vercel
export default app;

// Inicia o servidor apenas se não estiver no Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📌 Ambiente: ${env.NODE_ENV}`);
    console.log(`🌐 Frontend URL: ${env.FRONTEND_URL}`);
  });
}

// Tratamento de erros não capturados
process.on('unhandledRejection', (err: Error) => {
  console.error('❌ Unhandled Rejection:', err);
  if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    process.exit(1);
  }
});

process.on('uncaughtException', (err: Error) => {
  console.error('❌ Uncaught Exception:', err);
  if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    process.exit(1);
  }
});


