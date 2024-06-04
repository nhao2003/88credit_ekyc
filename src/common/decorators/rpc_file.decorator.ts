import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RpcArgumentsHost } from '@nestjs/common/interfaces';

export const RpcFile = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const ctx: RpcArgumentsHost = context.switchToRpc();
    const request = ctx.getData();
    // return data ? request.file?[data] : request.file;
    return data ? request?.file[data] : request?.file;
  },
);
