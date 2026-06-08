import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsConsumer } from './analytics.consumer';
import { AnalyticsController } from './analytics.controller';
import { PartAddedConsumer } from './part-added.consumer';

@Module({
  providers: [AnalyticsService, AnalyticsConsumer, PartAddedConsumer],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
