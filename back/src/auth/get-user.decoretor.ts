import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // Se o campo solicitado for 'id', retorne 'userId'
    if (data === 'id') {
      return user?.userId;
    }

    return data ? user?.[data] : user;
  },
);
