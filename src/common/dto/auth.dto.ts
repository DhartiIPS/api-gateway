import { IsEmail, IsString, MinLength, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { Role } from '../enums/role.enum';
import { Type } from 'class-transformer';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  blood_group?: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  date_of_birth?: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  hospital_id?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  specialty_id?: number;

  @IsOptional()
  @IsString()
  education?: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  experience?: number;

  
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  profileImage?: string;
}
