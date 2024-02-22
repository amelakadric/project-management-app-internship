import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Priority } from '../../tickets/enums/priorities.enum';
import { Type } from '../../tickets/enums/types.enum';
import { Status } from '../../tickets/enums/statuses.enum';
import { Project } from './project.entity';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Status, nullable: false })
  status: Status;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'enum', enum: Type, nullable: false })
  type: Type;

  @Column({ type: 'enum', enum: Priority, nullable: false })
  priority: Priority;

  @ManyToOne(() => User, (user) => user.createdTickets, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  createdBy: User;

  @ManyToOne(() => User, (user) => user.assignedTickets, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  assignedTo: User;

  @ManyToOne(() => Project, (project) => project.tickets, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  project: Project;
}
