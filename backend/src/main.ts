import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Configurazione del prefisso globale per le API
  app.setGlobalPrefix('api');
  
  // Configurazione CORS per permettere richieste dal frontend
  app.enableCors({
    origin: 'http://localhost:5173', // URL del frontend Vite
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Aumenta il limite di dimensione del payload per le richieste
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  
  // Configura la directory per i file statici
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  
  // Avvio del server sulla porta specificata o 3000 come default
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
  console.log(`File uploads available at http://localhost:${port}/uploads`);
}

bootstrap();
