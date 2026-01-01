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

  send(pattern: string | Record<string, any>, data: any) {
    return this.client.send(pattern, data);
  }

  emit(pattern: string | Record<string, any>, data: any) {
    return this.client.emit(pattern, data);
  }

  getAppointments(filters?: any) {
    return this.send('appointment.list', filters || {});
  }

  getAppointment(appointmentId: string) {
    return this.send('appointment.get', { id: appointmentId });
  }

  createAppointment(appointmentData: any) {
    return this.send('appointment.create', appointmentData);
  }

  updateAppointment(appointmentId: string, updateData: any) {
    return this.send('appointment.update', { id: appointmentId, ...updateData });
  }

  cancelAppointment(appointmentId: string, reason?: string) {
    return this.send('appointment.cancel', { id: appointmentId, reason });
  }

  getDoctorAvailability(doctorId: string, date?: string) {
    return this.send('doctor.availability', { doctorId, date });
  }

  getDoctorProfile(doctorId: string) {
    return this.send('doctor.profile', { id: doctorId });
  }

  searchDoctors(query: any) {
    return this.send('doctor.search', query);
  }

  getHospitals() {
    return this.send('hospital.list', {});
  }
}
