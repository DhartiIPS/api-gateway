import { CallType } from '@/entities/call.entity';
import { IsString, IsEnum } from 'class-validator'

export class CreateCallDto {
  @IsString()
  callerId: string;

  @IsString()
  receiverId: string;

  @IsEnum(CallType)
  callType: CallType;
}
