import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET || 'secret',
    });
  }

  // Inject returned data in req.user. Payload is the JWT Token
  async validate(payload: any) {
    return { id: payload.sub, pseudo: payload.pseudo };
  }
}
