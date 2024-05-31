import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Socket } from 'socket.io';

@Catch(ValidationError)
export class ValidationSocketErrorFilter implements ExceptionFilter {
  catch(exception: ValidationError, host: ArgumentsHost) {
    const socket: Socket = host.switchToWs().getClient();

    socket.emit('exception', exception);
  }
}
