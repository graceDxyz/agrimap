import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use the MorganMiddleware to log requests and responses
  app.use(morgan('common'));
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: ['*'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Include 'OPTIONS' for preflight requests
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'Access-Control-Allow-Origin',
    ],
  });

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
          imgSrc: [
            "'self'",
            'data:',
            'https://cdn.jsdelivr.net',
            'http://cdn.jsdelivr.net',
          ], // Add 'http://cdn.jsdelivr.net' to img-src
        },
      },
    }),
  );

  // Use the ConfigService to access the port configuration
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 5000); // Use a default value (e.g., 5000)

  await app.listen(port);
}
bootstrap();
