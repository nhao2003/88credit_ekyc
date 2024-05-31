import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';
import { JwtPayload } from 'src/common/types/jwt-payload.types';

export const GetSocketUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const socket: Socket = ctx.switchToWs().getClient();
    const user = (socket as any).user as JwtPayload;
    return user;
  },
);
