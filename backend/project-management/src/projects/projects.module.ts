import { Module } from '@nestjs/common';
import { ProjectsService } from './services/projects.service';
import { ProjectsController } from './controllers/projects.controller';
import { ProjectsRepository } from 'src/database/repositories/projects.repository';
import { UsersRepository } from 'src/database/repositories/users.repository';
import { TicketsRepository } from 'src/database/repositories/tickets.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/database/entities/project.entity';
import { Ticket } from 'src/database/entities/ticket.entity';
import { User } from 'src/database/entities/user.entity';
import { TicketsService } from 'src/tickets/services/tickets.service';

@Module({
  providers: [
    ProjectsService,
    ProjectsRepository,
    UsersRepository,
    TicketsRepository,
    TicketsService,
  ],
  controllers: [ProjectsController],
  imports: [TypeOrmModule.forFeature([Ticket, User, Project])],
})
export class ProjectsModule {}
