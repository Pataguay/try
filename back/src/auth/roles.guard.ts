import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserRole } from '../user/entities/enums/user-role';
import { Reflector } from '@nestjs/core';
import { ROLES_KEYS } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEYS,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este recurso',
      );
    }
    const hasPermission = requiredRoles.some((role) => user.role === role);
    if (!hasPermission) {
      throw new ForbiddenException(`Você precisa ter um dos seguintes
 perfis: ${requiredRoles.join(', ')}`);
    }
    return true;
  }
}
