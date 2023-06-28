import { Module } from '@nestjs/common';
import { LedService } from './led.service';

@Module({
  imports: [],
  controllers: [],
  providers: [LedService],
})
export class LedModule {}
