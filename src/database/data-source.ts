// gateway/ormconfig.ts
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();

export default new DataSource({
  type: 'postgres',
  host: process.env.USER_DB_HOST || 'localhost',
  port: parseInt(process.env.USER_DB_PORT || '5432'),
  username: process.env.USER_DB_USERNAME || 'postgres',
  password: process.env.USER_DB_PASSWORD || 'ips12345',
  database: process.env.USER_DB_NAME || 'user_doctor',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});