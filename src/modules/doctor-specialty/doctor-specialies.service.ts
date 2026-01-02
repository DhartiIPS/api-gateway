import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { SpecialtyServiceClient } from '@/common/specialty-service.client';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class DoctorSpecialiesGatewayService {
  private readonly logger = new Logger(
    DoctorSpecialiesGatewayService.name,
  );

  constructor(
    private readonly specialtyClient: SpecialtyServiceClient,
  ) {}

  async getAllSpecialties() {
    try {
      return await firstValueFrom(
        this.specialtyClient
          .getAllSpecialties()
          .pipe(timeout(5000)),
      );
    } catch (error) {
      this.logger.error('Failed to fetch specialties', error as any);
      throw new BadRequestException('Failed to fetch specialties');
    }
  }

  async createSpecialty(name: string) {
    try {
      return await firstValueFrom(
        this.specialtyClient
          .createSpecialty(name)
          .pipe(timeout(5000)),
      );
    } catch (error) {
      this.logger.error('Failed to create specialty', error as any);
      throw new BadRequestException('Failed to create specialty');
    }
  }

  async updateSpecialty(id: number, name: string) {
    try {
      return await firstValueFrom(
        this.specialtyClient
          .updateSpecialty(id, name)
          .pipe(timeout(5000)),
      );
    } catch (error) {
      this.logger.error('Failed to update specialty', error as any);
      throw new BadRequestException('Failed to update specialty');
    }
  }

  async deleteSpecialty(id: number) {
    try {
      return await firstValueFrom(
        this.specialtyClient
          .deleteSpecialty(id)
          .pipe(timeout(5000)),
      );
    } catch (error) {
      this.logger.error('Failed to delete specialty', error as any);
      throw new BadRequestException('Failed to delete specialty');
    }
  }
}
