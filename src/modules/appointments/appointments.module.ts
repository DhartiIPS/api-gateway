import { Module } from '@nestjs/common';
import { AppointmentServiceClient } from '../../common/appointment-service.client';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService, AppointmentServiceClient],
  exports: [AppointmentServiceClient],
})
export class AppointmentsModule {}
