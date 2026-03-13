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
  ) { }

  @Post('message')
  async sendMessage(
    @Body('senderId') senderId: string,
    @Body('receiverId') receiverId: string,
    @Body('message') message: string,
    @Body('roomId') roomId?: string,
  ) {
    if (!senderId || !message) {
      throw new BadRequestException('Missing required fields: senderId, message');
    }

    this.logger.log(`Sending message from ${senderId}`);

    try {
      const payload: any = { senderId, message };
      if (receiverId) payload.receiverId = receiverId;
      if (roomId) payload.roomId = roomId;

      const response = await firstValueFrom(
        this.chatClient
          .send(
            { cmd: 'message' },
            payload,
          )
          .pipe(timeout(10000)),
      );

      return { success: true, data: response };
    } catch (error) {
      const errorMessage =
        (error as any)?.response?.message ||
        (error as any)?.message ||
        'Unknown error';
      this.logger.error(`Chat send failed - Error: ${errorMessage}`, error as any);
      throw new BadRequestException(`Unable to send message: ${errorMessage}`);
    }
  }


  @Get('getmessages')
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

    const payload: any = { senderId, receiverId };
    if (cursor) payload.cursor = cursor;
    if (limit) payload.limit = Number(limit);

    try {
      const response = await firstValueFrom(
        this.chatClient
          .send({ cmd: 'get_messages' }, payload)
          .pipe(timeout(10000)),
      );

      const items = Array.isArray((response as any)?.items)
        ? (response as any).items.map((item: any) => {
            const isOwnMessage = String(item.senderId) === String(senderId);
            return {
              ...item,
              isOwnMessage,
              direction: isOwnMessage ? 'sent' : 'received',
            };
          })
        : [];

      return {
        success: true,
        data: {
          ...response,
          items,
        },
      };
    } catch (error) {
      const errorMessage =
        (error as any)?.response?.message ||
        (error as any)?.message ||
        'Unknown error';
      this.logger.error(`Fetching messages failed: ${errorMessage}`, error as any);
      throw new BadRequestException(`Unable to fetch messages: ${errorMessage}`);
    }
  }

}
