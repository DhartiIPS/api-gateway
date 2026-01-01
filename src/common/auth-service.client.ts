import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthServiceClient {
  private client: ClientProxy;
  private readonly logger = new Logger(AuthServiceClient.name);

  constructor(private configService: ConfigService) {
    this.initializeClient();
  }

  private initializeClient() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: this.configService.get('AUTH_SERVICE_HOST', '127.0.0.1'),
        port: this.configService.get('AUTH_SERVICE_PORT', 5002),
      },
    });

    this.logger.log(
      `Auth Service Client initialized on ${this.configService.get('AUTH_SERVICE_HOST')}:${this.configService.get('AUTH_SERVICE_PORT')}`,
    );
  }

  send(pattern: string | Record<string, any>, data: any) {
    return this.client.send(pattern, data);
  }

  emit(pattern: string | Record<string, any>, data: any) {
    return this.client.emit(pattern, data);
  }

  validateToken(token: string) {
    return this.send({ cmd: 'validate_token' }, { token });
  }

  register(registerDto: any) {
    return this.send({ cmd: 'register' }, registerDto);
  }

  login(loginDto: any) {
    return this.send({ cmd: 'login' }, loginDto);
  }

  refreshToken(refreshToken: string) {
    return this.send({ cmd: 'refresh_token' }, { refreshToken });
  }

  getUserProfile(userId: string) {
    return this.send({ cmd: 'get_profile' }, { userId });
  }

  updateUserProfile(userId: string, profileData: any) {
    return this.send({ cmd: 'update_profile' }, { userId, ...profileData });
  }
}
