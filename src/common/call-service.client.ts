import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CallServiceClient {
  constructor(
    @Inject('CALL_SERVICE') private readonly client: ClientProxy,
  ) {}

  /**
   * Start a new call
   */
  async startCall(data: {
    callerId: string;
    receiverId: string;
    callType: 'audio' | 'video';
  }) {
    return lastValueFrom(
      this.client.send(
        { cmd: 'start_call' },
        data,
      ),
    );
  }

  /**
   * Accept incoming call
   */
  async acceptCall(data: {
    callId: string;
    userId: string;
  }) {
    return lastValueFrom(
      this.client.send(
        { cmd: 'accept_call' },
        data,
      ),
    );
  }

  /**
   * Reject incoming call
   */
  async rejectCall(data: {
    callId: string;
    userId: string;
  }) {
    return lastValueFrom(
      this.client.send(
        { cmd: 'reject_call' },
        data,
      ),
    );
  }

  /**
   * End call
   */
  async endCall(data: {
    callId: string;
    userId: string;
  }) {
    return lastValueFrom(
      this.client.send(
        { cmd: 'end_call' },
        data,
      ),
    );
  }

  /**
   * Get call history
   */
  async getCallHistory(data: {
    userId: string;
    cursor?: string;
    limit?: number;
  }) {
    return lastValueFrom(
      this.client.send(
        { cmd: 'get_call_history' },
        data,
      ),
    );
  }
}
