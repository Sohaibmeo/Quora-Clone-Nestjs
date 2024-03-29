import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { User } from '../../entity/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor() {
    super({
      jwtFromRequest: (req: Request) => {
        let token = null;
        if (req.headers.authorization) {
          token = req.headers.authorization.split(' ')[1];
        }
        return token.replace(/"/g, '');
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { sub: User['id']; email: User['email'] }) {
    this.logger.log(payload.email + ' is validated');
    return { id: payload.sub, email: payload.email };
  }
}
