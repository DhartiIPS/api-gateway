import { Injectable, Logger } from '@nestjs/common';
import { AuthServiceClient } from './common/auth-service.client';
import { AppointmentServiceClient } from './common/appointment-service.client';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private authServiceClient: AuthServiceClient,
    private appointmentServiceClient: AppointmentServiceClient,
  ) {}

  getHello(): string {
    return 'BFF Gateway is running!';
  }

  getStatus() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      message: 'Backend-for-Frontend Gateway is operational',
      services: {
        auth: 'Connected',
        appointments: 'Connected',
      },
    };
  }
}
