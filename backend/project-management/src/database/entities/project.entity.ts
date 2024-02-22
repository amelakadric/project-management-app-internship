import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Ticket } from './ticket.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @ManyToOne(() => User, (user) => user.projects, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  manager: User;

  @ApiProperty()
  @ManyToMany(() => User, (user) => user.employements, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  employees: User[];

  @ApiProperty()
  @OneToMany(() => Ticket, (ticket) => ticket.project, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  tickets: Ticket[];
}
