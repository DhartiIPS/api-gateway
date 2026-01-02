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

import { JwtGuard } from '@/common/guards/jwt.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/enums/role.enum';

import { DoctorSpecialiesGatewayService } from './doctor-specialies.service';

@Controller('doctor-specialties')
export class DoctorSpecialiesController {
  constructor(
    private readonly specialtyService: DoctorSpecialiesGatewayService,
  ) {}

  @Get('AllSpecialties')
  getAll() {
    return this.specialtyService.getAllSpecialties();
  }

  @Post('createspecialty')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: { name: string }) {
    return this.specialtyService.createSpecialty(body.name);
  }

  @Patch('updatespecialty/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() body: { name: string },
  ) {
    return this.specialtyService.updateSpecialty(
      Number(id),
      body.name,
    );
  }

  @Delete('deletespecialty/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  delete(@Param('id') id: string) {
    return this.specialtyService.deleteSpecialty(Number(id));
  }
}
