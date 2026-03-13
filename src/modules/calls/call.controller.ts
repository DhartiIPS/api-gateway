import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

const MS_TIMEOUT = 5_000;

@Controller('calls')
export class CallController {
  private readonly logger = new Logger(CallController.name);

  constructor(
    @Inject('CALL_SERVICE')
    private readonly callClient: ClientProxy,
  ) {}

  @Post('start')
  @HttpCode(HttpStatus.CREATED)
  startCall(
    @Body()
    body: { callerId: string; receiverId: string; callType: 'audio' | 'video' },
  ) {
    return this.send('start_call', body);
  }

  @Post(':id/accept')
  acceptCall(
    @Param('id') callId: string,
    @Body() body: { userId: string },
  ) {
    return this.send('accept_call', { callId, userId: body.userId });
  }

  @Post(':id/reject')
  rejectCall(
    @Param('id') callId: string,
    @Body() body: { userId: string; reason?: string },
  ) {
    return this.send('reject_call', { callId, ...body });
  }

  @Post(':id/cancel')
  cancelCall(
    @Param('id') callId: string,
    @Body() body: { userId: string },
  ) {
    return this.send('cancel_call', { callId, userId: body.userId });
  }


  @Post(':id/end')
  endCall(
    @Param('id') callId: string,
    @Body() body: { userId: string; reason?: string },
  ) {
    return this.send('end_call', { callId, ...body });
  }


  @Get('history')
  getCallHistory(
    @Query('userId') userId: string,
    @Query('limit') limit = 20,
    @Query('cursor') cursor?: string,
  ) {
    return this.send('get_call_history', { userId, limit: +limit, cursor });
  }

  @Get('missed')
  getMissedCalls(@Query('userId') userId: string) {
    return this.send('get_missed_calls', { userId });
  }

  private async send<T>(cmd: string, payload: unknown): Promise<T> {
    try {
      return await firstValueFrom<T>(
        this.callClient.send<T>({ cmd }, payload).pipe(timeout(MS_TIMEOUT)),
      );
    } catch (error) {
      this.logger.error(`[${cmd}] failed → ${error}`);
      throw error;
    }
  }
}