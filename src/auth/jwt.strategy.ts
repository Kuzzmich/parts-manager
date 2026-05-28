import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET') ?? 'secret',
    });
  }

  validate(payload: JwtPayload): { id: string; email: string } {
    console.log(payload);
    return { id: payload.sub, email: payload.email };
  }
}
