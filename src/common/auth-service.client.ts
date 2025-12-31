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

  /**
   * Send message to Auth Microservice
   */
  send(pattern: string | Record<string, any>, data: any) {
    return this.client.send(pattern, data);
  }

  /**
   * Emit event to Auth Microservice
   */
  emit(pattern: string | Record<string, any>, data: any) {
    return this.client.emit(pattern, data);
  }

  /**
   * Validate JWT token with Auth Service
   */
  validateToken(token: string) {
    return this.send({ cmd: 'validate_token' }, { token });
  }

  /**
   * Register new user via Auth Service
   */
  register(registerDto: any) {
    return this.send({ cmd: 'register' }, registerDto);
  }

  /**
   * Login user via Auth Service
   */
  login(loginDto: any) {
    return this.send({ cmd: 'login' }, loginDto);
  }

  /**
   * Refresh JWT token
   */
  refreshToken(refreshToken: string) {
    return this.send({ cmd: 'refresh_token' }, { refreshToken });
  }

  /**
   * Get user profile
   */
  getUserProfile(userId: string) {
    return this.send({ cmd: 'get_profile' }, { userId });
  }

  /**
   * Update user profile
   */
  updateUserProfile(userId: string, profileData: any) {
    return this.send({ cmd: 'update_profile' }, { userId, ...profileData });
  }
}
