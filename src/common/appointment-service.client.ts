import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class AppointmentServiceClient {
  constructor(
    @Inject('APPOINTMENT_SERVICE') private readonly client: ClientProxy,
  ) {}

  getAppointments(data: any): Observable<any> {
    return this.client.send('allappointment', data);
  }

  getAppointment(appointmentId: string): Observable<any> {
    return this.client.send('get-appointment', { appointmentId });
  }

  createAppointment(data: any): Observable<any> {
    return this.client.send('book', data);
  }

  updateAppointment(appointmentId: string, data: any): Observable<any> {
    return this.client.send('update/:appointmentId', { appointmentId, ...data });
  }

  cancelAppointment(appointmentId: string, reason?: string): Observable<any> {
    return this.client.send('cancel/:appointmentId', { appointmentId, reason });
  }

  getDoctorProfile(doctorId: string): Observable<any> {
    return this.client.send('doctor-profile', { doctorId: Number(doctorId) });
  }

  searchDoctors(searchQuery: any): Observable<any> {
    return this.client.send('search-doctors', searchQuery);
  }

  // FIX: Use the correct message pattern
  getDoctorAppointmentCounts(doctorId: number): Observable<any> {
    return this.client.send('doctor_appointment_counts', { doctorId });
  }

  getPatientAppointmentCounts(patientId: number) {
    return this.client.send('patient_appointment_counts', { patientId });
  }

  getHospitals(): Observable<any> {
    return this.client.send('get-hospitals', {});
  }
}