import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { HospitalModule } from './modules/hospitals/hospitals.module';
import { DoctorSpecialiesModule } from './modules/doctor-specialty/doctor-specialies.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { NotificationModule } from './modules/notifications/notification.module';

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
    NotificationModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
