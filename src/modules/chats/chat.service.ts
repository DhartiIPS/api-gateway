import {
  Body,
  Controller,
  Post,
  Inject,
  Logger,
  BadRequestException,
  Get,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

@Controller('chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(
    @Inject('CHAT_SERVICE') private readonly chatClient: ClientProxy,
  ) {}

  @Post('message')
  async sendMessage(
    @Body('senderId') senderId: string,
    @Body('receiverId') receiverId: string,
    @Body('message') message: string,
  ) {
    if (!senderId || !receiverId || !message) {
      throw new BadRequestException('Missing required fields');
    }

    this.logger.log(`Chat message from ${senderId} to ${receiverId}`);

    try {
      const payload = { senderId, receiverId, message, timestamp: new Date() };

      const response = await firstValueFrom(
        this.chatClient
          .send({ cmd: 'message' }, payload)
          .pipe(timeout(10000)),
      );

      return { success: true, data: response };
    } catch (error) {
      this.logger.error('Chat send failed', error);
      throw new BadRequestException('Unable to send message');
    }
  }

  @Get('get_messages')
  async getMessages(
    @Query('senderId') senderId: string,
    @Query('receiverId') receiverId: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: number,
  ) {
    if (!senderId || !receiverId) {
      throw new BadRequestException('Missing required fields');
    }

    this.logger.log(`Fetching direct messages between ${senderId} and ${receiverId}`);

    try {
      const payload: any = { senderId, receiverId };
      if (cursor) payload.cursor = cursor;
      if (limit) payload.limit = Number(limit);

      const response = await firstValueFrom(
        this.chatClient
          .send({ cmd: 'get_messages' }, payload)
          .pipe(timeout(10000)),
      );
      return { success: true, data: response };
    } catch (error) {
      this.logger.error('Fetching messages failed', error);
      throw new BadRequestException('Unable to fetch messages');
    }
  }
}
