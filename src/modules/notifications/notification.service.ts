import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { NotificationServiceClient } from '../../common/notification-service.client';
import { firstValueFrom, timeout } from 'rxjs';
import { Notification } from 'pg';

@Injectable()
export class NotificationGatewayService {
  private readonly logger = new Logger(NotificationGatewayService.name);

  constructor(private notificationClient: NotificationServiceClient) { }

  async getNotifications(userId: number) {
    try {
      return await firstValueFrom(
        this.notificationClient.getNotifications(userId).pipe(timeout(5000)),
      );
    } catch (error) {
      this.logger.error('Failed to fetch notifications', error as any);
      throw new BadRequestException('Failed to fetch notifications');
    }
  }

  async getAllNotifications() {
    try {
      return await firstValueFrom(
        this.notificationClient.getAllNotifications().pipe(timeout(5000)),
      );
    } catch (error) {
      this.logger.error('Failed to fetch all notifications', error as any);
      throw new BadRequestException('Failed to fetch all notifications');
    }
  }

  async getNotificationsByRole(role: 'admin' | 'doctor' | 'patient') {
    try {
      return await firstValueFrom(
        this.notificationClient.getNotificationsByRole(role).pipe(timeout(5000)),
      );
    } catch (error) {
      this.logger.error('Failed to fetch notifications by role', error as any);
      throw new BadRequestException('Failed to fetch notifications by role');
    }
  }

  async markAsRead(notificationId: number) {
    try {
      return await firstValueFrom(
        this.notificationClient.markAsRead(notificationId).pipe(timeout(5000)),
      );
    } catch (error) {
      this.logger.error('Failed to mark notification as read', error as any);
      throw new BadRequestException('Failed to mark notification as read');
    }
  }

  async markAllAsRead(userId: number) {
    try {
      return await firstValueFrom(
        this.notificationClient.markAllAsRead(userId).pipe(timeout(5000)),
      );
    } catch (error) {
      this.logger.error('Failed to mark all notifications as read', error as any);
      throw new BadRequestException('Failed to mark all notifications as read');
    }
  }

  async createNotification(data: {
    userId: number;
    title: string;
    message: string;
    appointmentId?: number;
  }): Promise<Notification> {
    try {
      return await firstValueFrom(
        this.notificationClient
          .createNotification(data)
          .pipe(timeout(5000)),
      );
    } catch (error) {
      this.logger.error('Failed to create notification', error as any);
      throw new BadRequestException('Failed to create notification');
    }
  }
}