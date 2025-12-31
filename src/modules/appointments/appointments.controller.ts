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
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
  SearchDoctorsDto,
} from '../../common/dto/appointment.dto';
import { JwtGuard } from '../../common/guards/jwt.guard';

@Controller('api/appointments')
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  /**
   * Get all appointments for the authenticated user
   */
  @Get()
  @UseGuards(JwtGuard)
  async getAppointments(@Request() req: any, @Query() filters?: any) {
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestException('User ID not found in token');
    }
    return this.appointmentsService.getAppointments(userId, filters);
  }

  /**
   * Get a specific appointment by ID
   */
  @Get(':id')
  @UseGuards(JwtGuard)
  async getAppointment(@Param('id') appointmentId: string) {
    if (!appointmentId) {
      throw new BadRequestException('Appointment ID is required');
    }
    return this.appointmentsService.getAppointment(appointmentId);
  }

  /**
   * Create a new appointment
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  async createAppointment(@Request() req: any, @Body() createDto: CreateAppointmentDto) {
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestException('User ID not found in token');
    }

    if (!createDto.doctorId || !createDto.appointmentDate) {
      throw new BadRequestException('Doctor ID and appointment date are required');
    }

    return this.appointmentsService.createAppointment(userId, createDto);
  }

  /**
   * Update an appointment
   */
  @Put(':id')
  @UseGuards(JwtGuard)
  async updateAppointment(
    @Param('id') appointmentId: string,
    @Body() updateDto: UpdateAppointmentDto,
  ) {
    if (!appointmentId) {
      throw new BadRequestException('Appointment ID is required');
    }
    return this.appointmentsService.updateAppointment(appointmentId, updateDto);
  }

  /**
   * Cancel an appointment
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async cancelAppointment(@Param('id') appointmentId: string, @Body('reason') reason?: string) {
    if (!appointmentId) {
      throw new BadRequestException('Appointment ID is required');
    }
    return this.appointmentsService.cancelAppointment(appointmentId, reason);
  }

  /**
   * Get doctor availability
   */
  @Get('doctor/:doctorId/availability')
  async getDoctorAvailability(
    @Param('doctorId') doctorId: string,
    @Query('date') date?: string,
  ) {
    if (!doctorId) {
      throw new BadRequestException('Doctor ID is required');
    }
    return this.appointmentsService.getDoctorAvailability(doctorId, date);
  }

  /**
   * Get doctor profile
   */
  @Get('doctor/:doctorId')
  async getDoctorProfile(@Param('doctorId') doctorId: string) {
    if (!doctorId) {
      throw new BadRequestException('Doctor ID is required');
    }
    return this.appointmentsService.getDoctorProfile(doctorId);
  }

  /**
   * Search doctors
   */
  @Get('search/doctors')
  async searchDoctors(@Query() searchQuery: SearchDoctorsDto) {
    return this.appointmentsService.searchDoctors(searchQuery);
  }

  /**
   * Get all hospitals
   */
  @Get('hospitals/list')
  async getHospitals() {
    return this.appointmentsService.getHospitals();
  }
}
