// import { Catch, ArgumentsHost, WsExceptionFilter } from '@nestjs/common';
// import { WsException } from '@nestjs/websockets';
// import e from 'express';
// import { Socket } from 'socket.io';

// // Catch All Exceptions
// @Catch()
// export class WebSocketExceptionFilter implements WsExceptionFilter {
//   catch(exception: Error, host: ArgumentsHost) {
//     const ctx = host.switchToWs();
//     const client: Socket = ctx.getClient();

//     client.emit('exception', exception.message);
//   }
// }
