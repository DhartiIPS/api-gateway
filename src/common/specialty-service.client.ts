import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class SpecialtyServiceClient {
  constructor(
    @Inject('DOCTOR_SPECIALTY_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  getAllSpecialties() {
    return this.client.send(
      { cmd: 'get_all_specialties' },
      {},
    );
  }

  createSpecialty(name: string) {
    return this.client.send(
      { cmd: 'create_specialty' },
      name,
    );
  }

  updateSpecialty(id: number, name: string) {
    return this.client.send(
      { cmd: 'update_specialty' },
      { id, name },
    );
  }

  deleteSpecialty(id: number) {
    return this.client.send(
      { cmd: 'delete_specialty' },
      id,
    );
  }
}
