import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { AppointmentServiceClient } from '../../common/appointment-service.client';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'APPOINTMENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 5000,
        },
      },
    ]),
  ],
  controllers: [AppointmentsController],
  providers: [
    AppointmentsService,
    AppointmentServiceClient,
  ],
})
export class AppointmentsModule {}
