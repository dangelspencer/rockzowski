import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LedModule } from './led/led.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), LedModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
