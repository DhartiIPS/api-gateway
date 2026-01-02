import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { HospitalGatewayService } from './hospitals.service';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Role } from '@/common/enums/role.enum';
import { Roles } from '@/common/decorators/roles.decorator';
@Controller('hospitals')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalGatewayService) {}

  @Get('allhospitals')
  getHospitals() {
    return this.hospitalService.getHospitals();
  }

  @Get(':id')
  getHospital(@Param('id') id: string) {
    return this.hospitalService.getHospitalById(Number(id));
  }

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  createHospital(@Body() body: { name: string; address?: string }) {
    return this.hospitalService.createHospital(body);
  }

  @Patch(':id')
  @UseGuards(JwtGuard, RolesGuard)
 @Roles(Role.ADMIN)
  updateHospital(
    @Param('id') id: string,
    @Body() body: { name?: string; address?: string },
  ) {
    return this.hospitalService.updateHospital(Number(id), body);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  deleteHospital(@Param('id') id: string) {
    return this.hospitalService.deleteHospital(Number(id));
  }
}
