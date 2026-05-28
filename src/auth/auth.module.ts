import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ManagersModule } from '../managers/managers.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { StringValue } from 'ms';

@Module({
  providers: [AuthService],
  exports: [AuthService],
  imports: [
    ManagersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'secret',
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as StringValue,
      },
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
