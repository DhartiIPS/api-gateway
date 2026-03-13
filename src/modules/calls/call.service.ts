import { CreateCallDto } from '@/common/dto/create-call.dto';
import { Call, CallStatus } from '@/entities/call.entity';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CallService {
  constructor(
    @InjectRepository(Call)
    private readonly callRepo: Repository<Call>,
  ) {}

  async createCall(data: CreateCallDto) {
    if (data.callerId === data.receiverId) {
      throw new BadRequestException('Cannot call yourself');
    }

    const roomId = `call_${uuidv4()}`;

    const call = this.callRepo.create({
      callerId: data.callerId,
      receiverId: data.receiverId,
      callType: data.callType,
      roomId,
      status: CallStatus.INITIATED,
    });

    await this.callRepo.save(call);
    return { callId: call.id, roomId ,receiverId: call.receiverId };
  }


  async acceptCall(callId: string, userId: string): Promise<Call> {
    const call = await this.findById(callId);

    if (call.receiverId !== userId) {
      throw new ForbiddenException('Only the receiver can accept this call');
    }
    if (call.status !== CallStatus.INITIATED) {
      throw new BadRequestException(`Cannot accept a call with status: ${call.status}`);
    }

    call.status = CallStatus.ACCEPTED;
    call.startedAt = new Date();
    return this.callRepo.save(call);
  }

  async rejectCall(callId: string, userId: string, reason?: string): Promise<Call> {
    const call = await this.findById(callId);

    if (call.receiverId !== userId) {
      throw new ForbiddenException('Only the receiver can reject this call');
    }
    if (call.status !== CallStatus.INITIATED) {
      throw new BadRequestException(`Cannot reject a call with status: ${call.status}`);
    }

    call.status = CallStatus.REJECTED;
    call.endedAt = new Date();
    // call.endReason = reason ?? 'rejected';
    return this.callRepo.save(call);
  }

  async endCall(callId: string, userId: string, reason?: string): Promise<Call> {
    const call = await this.findById(callId);

    if (call.callerId !== userId && call.receiverId !== userId) {
      throw new ForbiddenException('Not a participant of this call');
    }
    if (
      call.status !== CallStatus.ACCEPTED &&
      call.status !== CallStatus.INITIATED
    ) {
      throw new BadRequestException(`Cannot end a call with status: ${call.status}`);
    }

    call.status = CallStatus.ENDED;
    call.endedAt = new Date();
    if (call.startedAt) {
      call.duration = Math.floor(
        (call.endedAt.getTime() - call.startedAt.getTime()) / 1000,
      );
    }

    return this.callRepo.save(call);
  }

  async getCallHistory(params: {
    userId: string;
    cursor?: string;
    limit?: number;
  }) {
    const limit = Math.min(params.limit ?? 20, 100);

    const qb = this.callRepo
      .createQueryBuilder('call')
      .where('(call.callerId = :uid OR call.receiverId = :uid)', { uid: params.userId })
      .orderBy('call.createdAt', 'DESC')
      .take(limit + 1);

    if (params.cursor) {
      const cursorCall = await this.callRepo.findOne({ where: { id: params.cursor } });
      if (cursorCall) {
        qb.andWhere('call.createdAt < :cursorDate', { cursorDate: cursorCall.createdAt });
      }
    }

    const rows = await qb.getMany();
    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;

    return {
      items,
      nextCursor: hasMore ? (items[items.length - 1]?.id ?? null) : null,
      hasMore,
    };
  }

  async getMissedCalls(userId: string): Promise<Call[]> {
    return this.callRepo.find({
      where: { receiverId: userId, status: CallStatus.MISSED },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  private async findById(callId: string): Promise<Call> {
    const call = await this.callRepo.findOne({ where: { id: callId } });
    if (!call) throw new NotFoundException(`Call not found: ${callId}`);
    return call;
  }
}