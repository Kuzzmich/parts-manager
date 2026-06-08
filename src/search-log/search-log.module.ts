import { Module } from '@nestjs/common';
import { SearchLogService } from './search-log.service';
import { SearchLogController } from './search-log.controller';
import { SearchLogConsumer } from './search-log.consumer';
import { AnalyticsConsumer } from './analytics.consumer';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';

@Module({
  providers: [SearchLogService, SearchLogConsumer, AnalyticsConsumer, AnalyticsService],
  controllers: [SearchLogController, AnalyticsController],
})
export class SearchLogModule {}
