import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LedService } from './led/led.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const ledService = await app.get(LedService);

  await ledService.run();
}
bootstrap();
