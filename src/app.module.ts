// api-gateway/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
// Import other modules as needed
// import { AppointmentsModule } from './appointments/appointments.module';
// import { NotificationsModule } from './notifications/notifications.module';
// import { HospitalsModule } from './hospitals/hospitals.module';
// import { DoctorSpecialtiesModule } from './doctor-specialties/doctor-specialties.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    // Add other gateway modules here
    // AppointmentsModule,
    // NotificationsModule,
    // HospitalsModule,
    // DoctorSpecialtiesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}