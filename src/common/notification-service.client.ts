import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class NotificationServiceClient {
  constructor(@Inject('NOTIFICATION_SERVICE') private client: ClientProxy) {}

  getNotifications(userId: number): Observable<any> {
    return this.client.send('notifications_by_user', { userId });
  }

  getAllNotifications(): Observable<any> {
    return this.client.send('admin_all_notifications', {});
  }

  getNotificationsByRole(role: 'admin' | 'doctor' | 'patient'): Observable<any> {
    return this.client.send('notifications_by_role', { role });
  }

  markAsRead(notificationId: number): Observable<any> {
    return this.client.send('notification_mark_read', { notificationId });
  }

  markAllAsRead(userId: number): Observable<any> {
    return this.client.send('notification_mark_all_read', { userId });
  }

  createNotification(data: {
    userId: number;
    title: string;
    message: string;
    appointmentId?: number;
  }): Observable<any> {
    return this.client.send('notification_create', data);
  }
}