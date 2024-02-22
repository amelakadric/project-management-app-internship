import { Gender } from '../../users/enums/genders.enum';
import { Role } from '../../users/enums/roles.enum';
import { Ticket } from './ticket.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  password: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  firstname: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  lastname: string;

  @ApiProperty()
  @Column({ type: 'enum', enum: Gender, nullable: false })
  gender: Gender;

  @ApiProperty()
  @Column({ type: 'enum', enum: Role, default: Role.Employee })
  role: Role;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  phoneNumber: string;

  @ApiProperty()
  @OneToMany(() => Ticket, (task) => task.createdBy)
  createdTickets: Ticket[];

  @ApiProperty()
  @OneToMany(() => Ticket, (task) => task.assignedTo)
  assignedTickets: Ticket[];

  @ApiProperty()
  @OneToMany(() => Project, (project) => project.manager)
  projects: Project[];

  @ApiProperty()
  @ManyToMany(() => Project, (project) => project.employees)
  employements: Project[];
}
