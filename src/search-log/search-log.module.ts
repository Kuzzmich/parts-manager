import { Module } from '@nestjs/common';
import { SearchLogService } from './search-log.service';
import { SearchLogController } from './search-log.controller';
import { SearchLogConsumer } from './search-log.consumer';

@Module({
  providers: [SearchLogService, SearchLogConsumer],
  controllers: [SearchLogController],
})
export class SearchLogModule {}
