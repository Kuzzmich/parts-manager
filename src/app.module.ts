import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ManagersModule } from './managers/managers.module';
import { ClientsModule } from './clients/clients.module';
import { EquipmentModule } from './equipment/equipment.module';
import { PartsModule } from './parts/parts.module';
import { SearchLogModule } from './search-log/search-log.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { KafkaModule } from './kafka/kafka.module';
import { ContactsModule } from './contacts/contacts.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    // global modules
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    PrismaModule,
    RedisModule,
    KafkaModule,
    // local modules
    AuthModule,
    ManagersModule,
    ClientsModule,
    EquipmentModule,
    PartsModule,
    SearchLogModule,
    ContactsModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
