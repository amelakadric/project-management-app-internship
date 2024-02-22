import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { UsersRepository } from 'src/database/repositories/users.repository';
import { UsersService } from './services/users.service';
import { TicketsRepository } from 'src/database/repositories/tickets.repository';
import { Ticket } from 'src/database/entities/ticket.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ProjectsService } from 'src/projects/services/projects.service';
import { ProjectsRepository } from 'src/database/repositories/projects.repository';
import { Project } from 'src/database/entities/project.entity';
import { TicketsService } from 'src/tickets/services/tickets.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Ticket, Project])],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    ProjectsService,
    ProjectsRepository,
    TicketsService,
    TicketsRepository,
    RolesGuard,
  ],
  exports: [UsersService],
})
export class UsersModule {}
