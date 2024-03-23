import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './products.constants';

@Injectable()
export class ProductsMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  // middleware pour vérifier un jwt dans le header de la requête

  use(req: Request, res: Response, next: NextFunction): void {
    const token = this.extractTokenFromHeader(req);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });
      if (!payload.isAdmin) {
        throw new UnauthorizedException();
      }

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      req['user'] = payload;
      next(); // Call next to pass control to the next middleware or route handler
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
