import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET', 'dev-secret-change-me'),
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
    org_id: string;
    roles: string[];
    permissions: string[];
  }) {
    return {
      id: payload.sub,
      email: payload.email,
      org_id: payload.org_id,
      roles: payload.roles,
      permissions: payload.permissions,
    };
  }
}
