import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://192.168.254.180:5173',
    },
  });
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  // app.setGlobalPrefix('/graphql');
  await app.listen(5000);
}
bootstrap();
