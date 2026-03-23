import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    /\.ngrok-free\.app$/,      // ← allows any ngrok URL
    /\.ngrok\.io$/,
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
});;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());

  const port = configService.get('GATEWAY_PORT', 3001);
  await app.listen(port);

  console.log(`API Gateway running on http://localhost:${port}`);
  console.log(
    `Connecting to Auth Service on port ${configService.get(
      'AUTH_SERVICE_PORT',
      5002,
    )}`,
  );
}

bootstrap().catch((err) => {
  console.error('Failed to start gateway:', err);
  process.exit(1);
});
