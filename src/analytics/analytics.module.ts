import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsConsumer } from './analytics.consumer';
import { AnalyticsController } from './analytics.controller';

@Module({
  providers: [AnalyticsService, AnalyticsConsumer],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
