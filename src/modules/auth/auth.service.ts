import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { AuthServiceClient } from '../../common/auth-service.client';
import { RegisterDto, LoginDto, UpdateProfileDto } from '../../common/dto/auth.dto';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private authServiceClient: AuthServiceClient) {}

  async register(registerDto: RegisterDto) {
    try {
      this.logger.log(`Registering user: ${registerDto.email}`);
      const result = await firstValueFrom(
        this.authServiceClient.register(registerDto).pipe(timeout(5000)),
      );
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Registration failed: ${errorMessage}`);
      
      // Check if it's a duplicate email error
      if (errorMessage.includes('already exists') || errorMessage.includes('duplicate')) {
        throw new BadRequestException('This email is already registered. Please use a different email or login.');
      }
      
      throw new BadRequestException(errorMessage || 'Registration failed. Please try again.');
    }
  }

  async login(loginDto: LoginDto) {
    try {
      this.logger.log(`Login attempt for user: ${loginDto.email}`);
      const result = await firstValueFrom(
        this.authServiceClient.login(loginDto).pipe(timeout(5000)),
      );
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Login failed: ${errorMessage}`);
      throw new BadRequestException('Login failed. Invalid credentials.');
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      this.logger.log('Refreshing token');
      const result = await firstValueFrom(
        this.authServiceClient.refreshToken(refreshToken).pipe(timeout(5000)),
      );
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Token refresh failed: ${errorMessage}`);
      throw new BadRequestException('Token refresh failed.');
    }
  }

  async getUserProfile(userId: string) {
    try {
      this.logger.log(`Fetching profile for user: ${userId}`);
      const result = await firstValueFrom(
        this.authServiceClient.getUserProfile(userId).pipe(timeout(5000)),
      );
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to fetch user profile: ${errorMessage}`);
      throw new BadRequestException('Failed to fetch user profile.');
    }
  }

  async updateUserProfile(userId: string, profileData: UpdateProfileDto) {
    try {
      this.logger.log(`Updating profile for user: ${userId}`);
      const result = await firstValueFrom(
        this.authServiceClient.updateUserProfile(userId, profileData).pipe(timeout(5000)),
      );
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to update user profile: ${errorMessage}`);
      throw new BadRequestException('Failed to update user profile.');
    }
  }

  async validateToken(token: string) {
    try {
      this.logger.log('Validating token');
      const result = await firstValueFrom(
        this.authServiceClient.validateToken(token).pipe(timeout(5000)),
      );
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Token validation failed: ${errorMessage}`);
      throw new BadRequestException('Invalid token.');
    }
  }
}
