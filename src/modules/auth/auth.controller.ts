// api-gateway/src/auth/auth.controller.ts
import { Controller, Post, Body, Get, Param, Patch, UseInterceptors, UploadedFile, Logger, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { firstValueFrom, timeout } from 'rxjs';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post('register')
  async register(@Body() dto: any) {
    try {
      this.logger.log(`Register request: ${dto.email}`);
      
      // Properly format the payload for TCP microservice
      const payload = {
        email: dto.email,
        password: dto.password,
        full_name: dto.full_name,
        role: dto.role,
        phone: dto.phone,
        date_of_birth: dto.date_of_birth,
        blood_group: dto.blood_group,
        age: dto.age,
        gender: dto.gender,
        address: dto.address,
        education: dto.education,
        experience: dto.experience,
      };
      
      const result = await firstValueFrom(
        this.authClient.send({ cmd: 'register' }, payload).pipe(timeout(10000))
      );
      return result;
    } catch (error) {
      // this.logger.error(`Register failed: ${error.message}`);
      throw new BadRequestException('Registration failed - ');
    }
  }

  @Post('login')
  async login(@Body() dto: any) {
    try {
      this.logger.log(`🌐 Gateway received login request: ${dto.email}`);
      console.log('🌐 Gateway received login request:', dto);
      
      // Ensure proper message format for TCP microservice
      const message = { cmd: 'login' };
      const payload = { email: dto.email, password: dto.password };
      
      const result = await firstValueFrom(
        this.authClient.send(message, payload).pipe(timeout(10000))
      );
      
      this.logger.log(`✅ Login successful for: ${dto.email}`);
      return result;
    } catch (error) {
      // this.logger.error(`❌ Login error: ${error.message}`, error.stack);
      console.error('TCP Error:', error);
      
      // if (error.message && error.message.includes('ECONNREFUSED')) {
      //   throw new BadRequestException('Auth service is not available. Please try again later.');
      // }
      
      throw new BadRequestException('Login failed - Invalid credentials or service error');
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: any) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'forgot_password' }, dto)
    );
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: any) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'reset_password' }, dto)
    );
  }

  @Get('patients')
  async getPatients() {
    return firstValueFrom(
      this.authClient.send({ cmd: 'get_patients' }, {})
    );
  }

  @Get('doctor')
  async getDoctors() {
    return firstValueFrom(
      this.authClient.send({ cmd: 'get_doctors' }, {})
    );
  }

  @Get('profile/:userId')
  async getProfile(@Param('userId') userId: string) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'get_profile' }, { userId })
    );
  }

  @Patch('profile/:userId')
  async updateProfile(@Param('userId') userId: string, @Body() dto: any) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'update_profile' }, { userId, dto })
    );
  }

  @Post('upload-photo/:userId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'upload_profile_photo' }, {
        userId: Number(userId),
        file: {
          buffer: file.buffer,
          mimetype: file.mimetype,
          originalname: file.originalname,
        },
      })
    );
  }
}