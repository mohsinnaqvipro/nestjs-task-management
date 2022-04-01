import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);

  const serverConfig = config.get('server');
  const port = process.env.PORT || serverConfig.port;

  await app.listen(port);
  logger.verbose(`Application is running on port ${port}`);
}
bootstrap();
