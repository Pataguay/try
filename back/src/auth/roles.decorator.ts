import { UserRole } from '../user/entities/enums/user-role';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEYS = 'roles';
export const Roles = (...roles: UserRole[]) => {
  return SetMetadata(ROLES_KEYS, roles);
};
