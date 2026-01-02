import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { HospitalServiceClient } from '../../common/hospital-service.client';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class HospitalGatewayService {
  private readonly logger = new Logger(HospitalGatewayService.name);

  constructor(private hospitalClient: HospitalServiceClient)   {}

  async getHospitals() {
    try {
      return await firstValueFrom(
        this.hospitalClient.getHospitals().pipe(timeout(5000)),
      );
    } catch (error) {
      this.logger.error('Failed to fetch hospitals', error as any);
      throw new BadRequestException('Failed to fetch hospitals');
    }
  }

  async getHospitalById(id: number) {
    try {
      return await firstValueFrom(
        this.hospitalClient.getHospitalById(id).pipe(timeout(5000)),
      );
    } catch (error) {
      this.logger.error('Failed to fetch hospital', error as any);
      throw new BadRequestException('Failed to fetch hospital');
    }
  }

  async createHospital(data: any) {
    try {
      return await firstValueFrom(
        this.hospitalClient.createHospital(data).pipe(timeout(5000)),
      );
    } catch (error) {
      this.logger.error('Failed to create hospital', error as any);
      throw new BadRequestException('Failed to create hospital');
    }
  }

  async updateHospital(id: number, data: any) {
    try {
      return await firstValueFrom(
        this.hospitalClient.updateHospital(id, data).pipe(timeout(5000)),
      );
    } catch (error) {
      this.logger.error('Failed to update hospital', error as any);
      throw new BadRequestException('Failed to update hospital');
    }
  }

  async deleteHospital(id: number) {
    try {
      return await firstValueFrom(
        this.hospitalClient.deleteHospital(id).pipe(timeout(5000)),
      );
    } catch (error) {
      this.logger.error('Failed to delete hospital', error as any);
      throw new BadRequestException('Failed to delete hospital');
    }
  }
}
