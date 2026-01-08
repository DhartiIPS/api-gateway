import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotificationServiceClient } from '@/common/notification-service.client';
import { NotificationGatewayService } from './notification.service';
import { NotificationController } from './notification.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 5000, // Update this to your notification service port
        },
      },
    ]),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationGatewayService,
    NotificationServiceClient,
  ],
})
export class NotificationModule {}