import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppointmentServiceClient {
  private client: ClientProxy;
  private readonly logger = new Logger(AppointmentServiceClient.name);

  constructor(private configService: ConfigService) {
    this.initializeClient();
  }

  private initializeClient() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: this.configService.get('APPOINTMENT_SERVICE_HOST', '127.0.0.1'),
        port: this.configService.get('APPOINTMENT_SERVICE_PORT', 5003),
      },
    });

    this.logger.log(
      `Appointment Service Client initialized on ${this.configService.get('APPOINTMENT_SERVICE_HOST')}:${this.configService.get('APPOINTMENT_SERVICE_PORT')}`,
    );
  }

  /**
   * Send message to Appointment Microservice
   */
  send(pattern: string | Record<string, any>, data: any) {
    return this.client.send(pattern, data);
  }

  /**
   * Emit event to Appointment Microservice
   */
  emit(pattern: string | Record<string, any>, data: any) {
    return this.client.emit(pattern, data);
  }

  /**
   * Get all appointments
   */
  getAppointments(filters?: any) {
    return this.send('appointment.list', filters || {});
  }

  /**
   * Get appointment by ID
   */
  getAppointment(appointmentId: string) {
    return this.send('appointment.get', { id: appointmentId });
  }

  /**
   * Create new appointment
   */
  createAppointment(appointmentData: any) {
    return this.send('appointment.create', appointmentData);
  }

  /**
   * Update appointment
   */
  updateAppointment(appointmentId: string, updateData: any) {
    return this.send('appointment.update', { id: appointmentId, ...updateData });
  }

  /**
   * Cancel appointment
   */
  cancelAppointment(appointmentId: string, reason?: string) {
    return this.send('appointment.cancel', { id: appointmentId, reason });
  }

  /**
   * Get doctor availability
   */
  getDoctorAvailability(doctorId: string, date?: string) {
    return this.send('doctor.availability', { doctorId, date });
  }

  /**
   * Get doctor profile
   */
  getDoctorProfile(doctorId: string) {
    return this.send('doctor.profile', { id: doctorId });
  }

  /**
   * Search doctors
   */
  searchDoctors(query: any) {
    return this.send('doctor.search', query);
  }

  /**
   * Get hospitals
   */
  getHospitals() {
    return this.send('hospital.list', {});
  }
}
