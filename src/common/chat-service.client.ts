import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ChatServiceClient {
  constructor(
    @Inject('CHAT_SERVICE') private readonly client: ClientProxy,
  ) {}

  async sendMessage(data: {
    username: string;
    message: string;
    timestamp: Date;
  }) {
    return lastValueFrom(
      this.client.send(
        { cmd: 'message' },
        data,
      ),
    );
  }

  getDirectMessages(data: { senderId: string; receiverId: string; cursor?: string; limit?: number }) {
    return lastValueFrom(
      this.client.send(
        { cmd: 'get_messages' },
        data,
      ),
    );
  }
}
