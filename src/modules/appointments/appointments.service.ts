import { Injectable, Logger, BadRequestException, ConflictException } from '@nestjs/common';
import { AppointmentServiceClient } from '../../common/appointment-service.client';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
  SearchDoctorsDto,
} from '../../common/dto/appointment.dto';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(private appointmentServiceClient: AppointmentServiceClient) { }

  async getAppointments(userId: string, filters?: any) {
    try {
      this.logger.log(`Fetching appointments for user: ${userId}`);
      const result = await firstValueFrom(
        this.appointmentServiceClient.getAppointments({ ...filters, userId }).pipe(timeout(5000)),
      );
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to fetch appointments: ${errorMessage}`);
      throw new BadRequestException('Failed to fetch appointments.');
    }
  }

  async getAppointment(appointmentId: string) {
    try {
      this.logger.log(`Fetching appointment: ${appointmentId}`);
      const result = await firstValueFrom(
        this.appointmentServiceClient.getAppointment(appointmentId).pipe(timeout(5000)),
      );
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to fetch appointment: ${errorMessage}`);
      throw new BadRequestException('Failed to fetch appointment.');
    }
  }

  async createAppointment(userId: string, createDto: CreateAppointmentDto) {
    try {
      this.logger.log(`Creating appointment for user: ${userId}`);
      const appointmentData = {
        ...createDto,
        patient_id: createDto.patient_id || Number(userId),
      };
      const result = await firstValueFrom(
        this.appointmentServiceClient.createAppointment(appointmentData).pipe(timeout(5000)),
      );
      return result;
    } catch (error) {
      const statusCode = (error as any)?.error?.statusCode || (error as any)?.status || 400;
      const message =
        (error as any)?.error?.message ||
        (error as any)?.message ||
        'Failed to create appointment.';
      this.logger.error(`Failed to create appointment: ${message}`);
      if (statusCode === 409) {
        throw new ConflictException(message);
      }
      throw new BadRequestException(message);
    }
  }

  async updateAppointment(appointmentId: string, updateDto: UpdateAppointmentDto) {
    try {
      this.logger.log(`Updating appointment: ${appointmentId}`);
      const result = await firstValueFrom(
        this.appointmentServiceClient.updateAppointment(appointmentId, updateDto).pipe(timeout(5000)),
      );
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to update appointment: ${errorMessage}`);
      throw new BadRequestException('Failed to update appointment.');
    }
  }

  async cancelAppointment(appointmentId: string, reason?: string) {
    try {
      this.logger.log(`Cancelling appointment: ${appointmentId}`);
      const result = await firstValueFrom(
        this.appointmentServiceClient.cancelAppointment(appointmentId, reason).pipe(timeout(5000)),
      );
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to cancel appointment: ${errorMessage}`);
      throw new BadRequestException('Failed to cancel appointment.');
    }
  }

  // async getDoctorAvailability(doctorId: string, date?: string) {
  //   try {
  //     this.logger.log(`Fetching availability for doctor: ${doctorId}`);
  //     const result = await firstValueFrom(
  //       this.appointmentServiceClient.getDoctorAvailability(doctorId, date).pipe(timeout(5000)),
  //     );
  //     return result;
  //   } catch (error) {
  //     const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  //     this.logger.error(`Failed to fetch doctor availability: ${errorMessage}`);
  //     throw new BadRequestException('Failed to fetch doctor availability.');
  //   }
  // }

  async getDoctorProfile(doctorId: string) {
    try {
      this.logger.log(`Fetching doctor profile: ${doctorId}`);
      const result = await firstValueFrom(
        this.appointmentServiceClient.getDoctorProfile(doctorId).pipe(timeout(5000)),
      );
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to fetch doctor profile: ${errorMessage}`);
      throw new BadRequestException('Failed to fetch doctor profile.');
    }
  }

  async searchDoctors(searchQuery: SearchDoctorsDto) {
    try {
      this.logger.log(`Searching doctors with query: ${JSON.stringify(searchQuery)}`);
      const result = await firstValueFrom(
        this.appointmentServiceClient.searchDoctors(searchQuery).pipe(timeout(5000)),
      );
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to search doctors: ${errorMessage}`);
      throw new BadRequestException('Failed to search doctors.');
    }
  }

  async getDoctorAppointmentCounts(doctorId: number) {
    try {
      this.logger.log(`Fetching appointment counts for doctor: ${doctorId}`);
      const result = await firstValueFrom(
        this.appointmentServiceClient.getDoctorAppointmentCounts(doctorId).pipe(timeout(5000)),
      );
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to fetch doctor appointment counts: ${errorMessage}`);
      throw new BadRequestException('Failed to fetch doctor appointment counts.');
    }
  }

  async getPatientAppointmentCounts(patientId: number){
    try {
      this.logger.log(`Fetching appointment counts for doctor: ${patientId}`);
      const result = await firstValueFrom(
        this.appointmentServiceClient.getPatientAppointmentCounts(patientId).pipe(timeout(5000)),
      );
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to fetch doctor appointment counts: ${errorMessage}`);
      throw new BadRequestException('Failed to fetch doctor appointment counts.');
    }
  }

  async getHospitals() {
    try {
      this.logger.log('Fetching hospitals list');
      const result = await firstValueFrom(
        this.appointmentServiceClient.getHospitals().pipe(timeout(5000)),
      );
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to fetch hospitals: ${errorMessage}`);
      throw new BadRequestException('Failed to fetch hospitals.');
    }
  }

  async getUpcomingAppointments(doctorId: number) {
    try {
      this.logger.log(`Fetching upcoming appointments for doctor: ${doctorId}`);
      const result = await firstValueFrom(
        this.appointmentServiceClient.getUpcomingAppointments(doctorId).pipe(timeout(5000)),
      );
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to fetch upcoming appointments: ${errorMessage}`);
      throw new BadRequestException('Failed to fetch upcoming appointments.');
    }
  }
}
