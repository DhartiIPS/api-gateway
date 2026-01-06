import { Controller, Post, Body, Get, Param, Patch, UseInterceptors, UploadedFile, Logger, BadRequestException, ValidationPipe, UsePipes, ConflictException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { firstValueFrom, timeout } from 'rxjs';
import { RegisterDto } from '@/common/dto/auth.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post('register')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )
  async register(@Body() dto: RegisterDto) {
    this.logger.log(`🌐 Register request: ${dto.email}`);

    try {
      const response = await firstValueFrom(
        this.authClient
          .send({ cmd: 'register' }, dto)
          .pipe(timeout(10000)),
      );

      return response;
    } catch (err) {
      const error = err as any;

      this.logger.error('❌ Registration failed', error);

      const statusCode =
        error?.error?.statusCode ||
        error?.status ||
        500;

      const message =
        error?.error?.message ||
        error?.message ||
        'Registration failed';

      if (statusCode === 409) {
        throw new ConflictException(message);
      }

      throw new BadRequestException(message);
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
      
      this.logger.log(`Login successful for: ${dto.email}`);
      return result;
    } catch (error) {
      console.error('TCP Error:', error);      
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

  @Get('available-doctors')
  async getAvailableDoctors() {
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