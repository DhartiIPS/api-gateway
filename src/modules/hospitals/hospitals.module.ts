import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HospitalController } from './hospitals.controller';
import { HospitalGatewayService } from './hospitals.service';
import { HospitalServiceClient } from '@/common/hospital-service.client';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'HOSPITAL_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 5003,
        },
      },
    ]),
  ],
  controllers: [HospitalController],
  providers: [
    HospitalGatewayService,
    HospitalServiceClient, 
  ],
})
export class HospitalModule {}
