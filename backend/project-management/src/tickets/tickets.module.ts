import { Module } from '@nestjs/common';
import { TicketsService } from './services/tickets.service';
import { TicketsController } from './controllers/tickets.controller';
import { TicketsRepository } from 'src/database/repositories/tickets.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from 'src/database/entities/ticket.entity';
import { UsersRepository } from 'src/database/repositories/users.repository';
import { User } from 'src/database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, User])],
  providers: [TicketsService, TicketsRepository, UsersRepository],
  controllers: [TicketsController],
})
export class TicketsModule {}
