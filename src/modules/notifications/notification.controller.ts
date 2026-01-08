import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Post,
  Body,
} from '@nestjs/common';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Role } from '@/common/enums/role.enum';
import { Roles } from '@/common/decorators/roles.decorator';
import { NotificationGatewayService } from './notification.service';

@Controller('notifications')
@UseGuards(JwtGuard)
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationGatewayService,
  ) { }

  @Get('user/:userId')
  getNotifications(@Param('userId') userId: string) {
    return this.notificationService.getNotifications(Number(userId));
  }

  @Get('admin/allnotifications')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  getAllNotifications() {
    return this.notificationService.getAllNotifications();
  }

  @Get('by-role')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  getNotificationsByRole(@Query('role') role: 'admin' | 'doctor' | 'patient') {
    return this.notificationService.getNotificationsByRole(role);
  }

  @Patch('read/:id')
  @HttpCode(HttpStatus.OK)
  markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(Number(id));
  }

  @Patch('user/:userId/read-all')
  @HttpCode(HttpStatus.OK)
  markAllAsRead(@Param('userId') userId: string) {
    return this.notificationService.markAllAsRead(Number(userId));
  }

  @Post('create')
  createNotification(data: {
    userId: number;
    title: string;
    message: string;
    appointmentId?: number;
  }) {
    return this.notificationService.createNotification(data);
  }

}