import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurazione del prefisso globale per le API
  app.setGlobalPrefix('api');
  
  // Configurazione CORS per permettere richieste dal frontend
  app.enableCors({
    origin: 'http://localhost:5173', // URL del frontend Vite
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Avvio del server sulla porta specificata o 3000 come default
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}

bootstrap();
