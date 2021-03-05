import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: true,
  });

  // app.setGlobalPrefix('api');

  // app.enableCors({ origin: 'http://localhost:9528' });

  app.useGlobalPipes(new ValidationPipe());

  app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: '/static/' });

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('pug');

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
}
bootstrap();
