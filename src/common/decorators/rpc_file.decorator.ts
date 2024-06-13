import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RpcArgumentsHost } from '@nestjs/common/interfaces';

export const RpcFile = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const ctx: RpcArgumentsHost = context.switchToRpc();
    const request = ctx.getData();
    // return data ? request.file?[data] : request.file;
    const file = data ? request?.file[data] : request?.file;
    const blob = new Blob([file.buffer], { type: file.mimetype });
    console.log('blob', blob);
    return file;
  },
);
