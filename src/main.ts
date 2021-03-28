import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

import * as helmet from 'helmet';
// import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: true,
  });

  console.log(process.env.NODE_ENV);

  app.setGlobalPrefix('blog');

  app.enableCors({
    origin: [
      'https://admin.vaqua.top',
      'https://www.vaqua.top',
      'https://vaqua.top',
    ],
  });

  app.use(helmet());
  // app.use(csurf());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );
  app.set('trust proxy', 1);

  app.useGlobalPipes(new ValidationPipe());

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
}
bootstrap();
