import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetSocketUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const socket = ctx.switchToWs().getClient();
    return socket.user.id;
  },
);
