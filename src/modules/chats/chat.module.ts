import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ChatController } from './chat.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CHAT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port :4002, 
        },
      },
    ]),
  ],
  controllers: [ChatController],
})
export class ChatModule {}
