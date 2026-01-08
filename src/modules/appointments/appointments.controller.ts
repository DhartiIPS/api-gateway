import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Patch,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
  SearchDoctorsDto,
} from '../../common/dto/appointment.dto';
import { JwtGuard } from '../../common/guards/jwt.guard';

@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) { }

  @Get('allappointment')
  @UseGuards(JwtGuard)
  async getAppointments(@Request() req: any, @Query() filters?: any) {
    const userId = req.user?.id ?? req.user?.userId ?? req.user?.sub;
    if (!userId) {
      throw new BadRequestException('User ID not found in token');
    }
    return this.appointmentsService.getAppointments(userId, filters);
  }

  @Post('book')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  async createAppointment(@Request() req: any, @Body() createDto: CreateAppointmentDto) {
    const userId = req.user?.id ?? req.user?.userId ?? req.user?.sub;
    if (!userId) {
      throw new BadRequestException('User ID not found in token');
    }

    if (!createDto.doctor_id || !createDto.appointment_date) {
      throw new BadRequestException('Doctor ID and appointment date are required');
    }

    return this.appointmentsService.createAppointment(userId, createDto);
  }

  @Get('search/doctors')
  async searchDoctors(@Query() searchQuery: SearchDoctorsDto) {
    return this.appointmentsService.searchDoctors(searchQuery);
  }

  @Get('doctor-counts/:doctorId')
  @UseGuards(JwtGuard) // optional, depending if you want this protected
  async getDoctorAppointmentCounts(@Param('doctorId') doctorId: string) {
    if (!doctorId) {
      throw new BadRequestException('Doctor ID is required');
    }
    return this.appointmentsService.getDoctorAppointmentCounts(Number(doctorId));
  }

  @Get('counts/:patientId')
  @UseGuards(JwtGuard)
  async getPatientAppointmentCounts(@Param('patientId') patientId: string) {
    if (!patientId) {
      throw new BadRequestException('Patient ID is required');
    }
    return this.appointmentsService.getPatientAppointmentCounts(Number(patientId));
  }

  @Get('hospitals/list')
  async getHospitals() {
    return this.appointmentsService.getHospitals();
  }

  @Get('doctor/:doctorId')
  async getDoctorProfile(@Param('doctorId') doctorId: string) {
    if (!doctorId) {
      throw new BadRequestException('Doctor ID is required');
    }
    return this.appointmentsService.getDoctorProfile(doctorId);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async getAppointment(@Param('id') appointmentId: string) {
    if (!appointmentId) {
      throw new BadRequestException('Appointment ID is required');
    }
    return this.appointmentsService.getAppointment(appointmentId);
  }

  @Patch('update/:id') // Changed from @Put to @Patch
  @UseGuards(JwtGuard)
  async updateAppointment(
    @Param('id') appointmentId: string,
    @Body() updateDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.updateAppointment(appointmentId, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async cancelAppointment(@Param('id') appointmentId: string, @Body('reason') reason?: string) {
    if (!appointmentId) {
      throw new BadRequestException('Appointment ID is required');
    }
    return this.appointmentsService.cancelAppointment(appointmentId, reason);
  }

  @Get('upcoming/:doctorId')
  @UseGuards(JwtGuard)
  async getUpcomingAppointments(@Param('doctorId') doctorId: string) {
    if (!doctorId) {
      throw new BadRequestException('Doctor ID is required');
    }
    return this.appointmentsService.getUpcomingAppointments(Number(doctorId));
  }
}