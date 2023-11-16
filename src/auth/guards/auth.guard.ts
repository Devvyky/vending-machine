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
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers['authorization'] as string;

      if (!authHeader) return false;

      const authHeaderParts = authHeader.split(' ');
      if (authHeaderParts.length !== 2) return false;
      const [, jwt] = authHeaderParts;

      const { user, exp } = await this.authService.verifyJwt(jwt);

      if (!exp) return false;

      const TOKEN_EXP_MS = exp * 1000;
      const isJwtValid = Date.now() < TOKEN_EXP_MS;

      const validUser = await this.authService.validateUserId(user.id);

      if (isJwtValid && validUser) {
        request.user = validUser;
        return true;
      }
      return false;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
