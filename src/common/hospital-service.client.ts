import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class HospitalServiceClient {
  constructor(
    @Inject('HOSPITAL_SERVICE') private readonly client: ClientProxy,
  ) {}

  getHospitals() {
    return this.client.send({ cmd: 'get_all_hospitals' }, {});
  }

  getHospitalById(id: number) {
    return this.client.send({ cmd: 'get_hospital_by_id' }, id);
  }

  createHospital(data: any) {
    return this.client.send({ cmd: 'create_hospital' }, data);
  }

  updateHospital(id: number, data: any) {
    return this.client.send(
      { cmd: 'update_hospital' },
      { id, payload: data },
    );
  }

  deleteHospital(id: number) {
    return this.client.send({ cmd: 'delete_hospital' }, id);
  }
}
