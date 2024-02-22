import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import * as Extractor from 'passport-jwt-cookie-extractor';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: Extractor.fromCookie('jwt'),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
      passReqToCallback: true,
    });
  }

  async validate(request: any, payload: any) {
    request.user = {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
    return request.user;
  }
}
