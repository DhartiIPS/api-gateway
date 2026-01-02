import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { DoctorSpecialiesController } from './doctor-specialies.controller';
import { DoctorSpecialiesGatewayService } from './doctor-specialies.service';
import { SpecialtyServiceClient } from '@/common/specialty-service.client';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DOCTOR_SPECIALTY_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 5004,
        },
      },
    ]),
  ],
  controllers: [DoctorSpecialiesController],
  providers: [
    DoctorSpecialiesGatewayService,
    SpecialtyServiceClient,
  ],
})
export class DoctorSpecialiesModule {}
