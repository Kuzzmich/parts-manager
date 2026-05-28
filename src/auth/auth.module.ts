import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ManagersModule } from '../managers/managers.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { StringValue } from 'ms';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
  imports: [
    ManagersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: {
          expiresIn: (config.get('JWT_EXPIRES_IN') || '7d') as StringValue,
        },
      }),
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
