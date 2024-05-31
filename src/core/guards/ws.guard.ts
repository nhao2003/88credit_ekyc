import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const isWs = context.getType() === 'ws';
    if (isWs) {
      const client = context.switchToWs().getClient();
      // Get the auth token from the headers or handshake query
      const authToken =
        client.handshake.auth.authorization ||
        client.handshake.headers.authorization;

      if (!authToken) {
        console.log('Unauthorized: No auth token provided');
        throw new WsException('Unauthorized');
      }

      try {
        const decoded = this.jwtService.verify(authToken);
        client.user = decoded;
        return true;
      } catch (error) {
        console.error(error);
        console.log('Unauthorized: Invalid token');
        throw new WsException('Unauthorized');
      }
    }

    return true;
  }
}
