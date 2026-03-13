import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CallController } from './call.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
        {
        name: 'CALL_SERVICE',
        useFactory: () => ({
            transport: Transport.TCP,
            options: {
            host: 'localhost',
            port: 4008,
            },
        }),
        }
        ])
  ],
  controllers: [CallController],
})
export class CallModule {}