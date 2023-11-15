import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      if (context.getType() !== 'http') {
        return false;
      }
      const authHeader = context.switchToHttp().getRequest().headers[
        'authorization'
      ] as string;

      if (!authHeader) return false;

      const authHeaderParts = authHeader.split(' ');

      if (authHeaderParts.length !== 2) return false;

      const [, jwt] = authHeaderParts;

      console.log({ jwt });

      const { exp } = await this.authService.verifyJwt(jwt);

      if (!exp) return false;

      const TOKEN_EXP_MS = exp * 1000;
      const isJwtValid = Date.now() < TOKEN_EXP_MS;
      return isJwtValid;
    } catch (error) {
      console.log({ error });
      throw new UnauthorizedException();
    }
  }
}
