import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    private configService: ConfigService,
  ) {}

  async getHealth() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: this.configService.get('NODE_ENV'),
      services: {
        auth_service: {
          host: this.configService.get('AUTH_SERVICE_HOST'),
          port: this.configService.get('AUTH_SERVICE_PORT'),
        },
        appointment_service: {
          host: this.configService.get('APPOINTMENT_SERVICE_HOST'),
          port: this.configService.get('APPOINTMENT_SERVICE_PORT'),
        },
        databases: {
          user_doctor: {
            host: this.configService.get('USER_DB_HOST'),
            port: this.configService.get('USER_DB_PORT'),
            database: this.configService.get('USER_DB_NAME'),
          },
          appointment_doctor: {
            host: this.configService.get('APPOINTMENT_DB_HOST'),
            port: this.configService.get('APPOINTMENT_DB_PORT'),
            database: this.configService.get('APPOINTMENT_DB_NAME'),
          },
        },
      },
    };
  }
}
