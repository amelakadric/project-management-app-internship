import { Injectable } from '@nestjs/common';
import { Ticket } from '../../database/entities/ticket.entity';
import { TicketsRepository } from '../../database/repositories/tickets.repository';
import { UsersRepository } from '../../database/repositories/users.repository';
import { CreateTicketDto } from '../dtos/createTicket.dto';
import { UpdateTicketDto } from '../dtos/updateTicket.dto';
import { Type } from '../enums/types.enum';
import { Project } from '../../database/entities/project.entity';

@Injectable()
export class TicketsService {
  constructor(
    private ticketsRepository: TicketsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async createTicket(
    project: Project,
    userId: number,
    ticketData: CreateTicketDto,
  ): Promise<Ticket> {
    let assignedToUser = null;
    if (ticketData.assignedTo) {
      assignedToUser = await this.usersRepository.getUserById(
        ticketData.assignedTo,
      );
    }
    const createdByUser = await this.usersRepository.getUserById(userId);

    return this.ticketsRepository.createTicket(
      project,
      createdByUser,
      assignedToUser,
      ticketData,
    );
  }

  async getAll(): Promise<Ticket[]> {
    return this.ticketsRepository.getAll();
  }

  async getTicketById(projectId: number, ticketId: number): Promise<Ticket> {
    return this.ticketsRepository.getTicketById(projectId, ticketId);
  }

  async filterTickets(
    projectId: number,
    userId: number,
    ticketType: Type,
    title: string,
  ): Promise<Ticket[]> {
    return this.ticketsRepository.filterTickets(
      projectId,
      userId,
      ticketType,
      title,
    );
  }

  async updateTicket(
    projectId: number,
    ticketId: number,
    updateInfo: UpdateTicketDto,
  ): Promise<Ticket> {
    return this.ticketsRepository.updateTicket(projectId, ticketId, updateInfo);
  }

  async assignTicketToUser(
    projectId: number,
    ticketId: number,
    userId: number,
  ): Promise<Ticket> {
    const user = await this.usersRepository.getUserById(userId);

    return this.ticketsRepository.assignTicketToUser(ticketId, projectId, user);
  }

  async deleteTicket(id: number): Promise<Ticket> {
    return this.ticketsRepository.deleteTicket(id);
  }
}
