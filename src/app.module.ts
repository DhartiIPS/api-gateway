import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { HospitalModule } from './modules/hospitals/hospitals.module';
import { DoctorSpecialiesModule } from './modules/doctor-specialty/doctor-specialies.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { NotificationModule } from './modules/notifications/notification.module';
import { ChatModule } from './modules/chats/chat.module';
import { CallModule } from './modules/calls/call.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    HospitalModule,
    DoctorSpecialiesModule,
    AppointmentsModule,
    NotificationModule,
    ChatModule,
    CallModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
