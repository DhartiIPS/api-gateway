import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('appointments')
@Index(['userId'])
@Index(['doctorId'])
@Index(['appointmentDate'])
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  doctorId: string;

  @Column({ nullable: true })
  reason: string;

  @Column()
  appointmentDate: Date;

  @Column({ nullable: true })
  startTime: string;

  @Column({ nullable: true })
  endTime: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  })
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  fee: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
