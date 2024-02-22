import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../entities/ticket.entity';
import { UpdateTicketDto } from '../../tickets/dtos/updateTicket.dto';
import { CreateTicketDto } from '../../tickets/dtos/createTicket.dto';
import { User } from '../entities/user.entity';
import { Type } from '../../tickets/enums/types.enum';
import { Project } from '../entities/project.entity';

export class TicketsRepository extends Repository<Ticket> {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
  ) {
    super(
      ticketsRepository.target,
      ticketsRepository.manager,
      ticketsRepository.queryRunner,
    );
  }

  async getAll(): Promise<Ticket[]> {
    const tickets = await this.find();
    return tickets;
  }

  async getTicketById(projectId: number, ticketId: number): Promise<Ticket> {
    const ticket = await this.findOne({
      where: { id: ticketId, project: { id: projectId } },
      relations: { project: true },
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket with id #${ticketId} not found.`);
    }
    return ticket;
  }

  async filterTickets(
    projectId: number,
    userId: number,
    ticketType: Type,
    title: string,
  ): Promise<Ticket[]> {
    const query = this.createQueryBuilder('ticket')
      .where('ticket.projectId=:id', { id: projectId })
      .leftJoinAndSelect('ticket.createdBy', 'createdBy')
      .leftJoinAndSelect('ticket.assignedTo', 'assignedTo')
      .leftJoinAndSelect('ticket.project', 'project');
    if (title) {
      query.andWhere('ticket.title LIKE :title', { title: `%${title}%` });
    }

    if (ticketType) {
      query.andWhere('ticket.type= :ticketType', {
        ticketType: ticketType,
      });
    }
    if (userId) {
      query.andWhere(
        '(ticket.assignedToId= :userId or ticket.createdById= :userId)',
        { userId: userId },
      );
    }

    return query.getMany();
  }

  async getCreatedTickets(userCreated: User): Promise<Ticket[]> {
    const tickets = await this.find({ where: { createdBy: userCreated } });
    if (!tickets) {
      throw new NotFoundException(
        `Tickets with creator id #${userCreated.id} not found.`,
      );
    }
    return tickets;
  }

  async getAssignedTickets(userAssigned: User): Promise<Ticket[]> {
    const tickets = await this.find({ where: { assignedTo: userAssigned } });
    if (!tickets) {
      throw new NotFoundException(
        `Tickets with assigned user id #${userAssigned.id} not found.`,
      );
    }
    return tickets;
  }

  async createTicket(
    _project: Project,
    createdbyUser: User,
    assignedToUser: User,
    ticketInfo: CreateTicketDto,
  ): Promise<Ticket> {
    const ticket = await this.create({
      createdBy: createdbyUser,
      title: ticketInfo.title,
      description: ticketInfo.description,
      priority: ticketInfo.priority,
      status: ticketInfo.status,
      type: ticketInfo.type,
      project: _project,
    });
    if (assignedToUser) {
      ticket.assignedTo = assignedToUser;
    }
    return this.save(ticket);
  }

  async updateTicket(
    projectId: number,
    ticketId: number,
    ticketInfo: UpdateTicketDto,
  ): Promise<Ticket> {
    const ticket = await this.findOne({
      where: {
        id: ticketId,
        project: { id: projectId },
      },
      relations: { project: true },
    });
    if (!ticket) {
      throw new NotFoundException(`Ticket with id #${ticketId} not found.`);
    }
    Object.assign(ticket, ticketInfo);
    return this.save(ticket);
  }

  async assignTicketToUser(
    ticketId: number,
    projectId: number,
    user: User,
  ): Promise<Ticket> {
    const ticket = await this.getTicketById(projectId, ticketId);
    ticket.assignedTo = user;
    return this.save(ticket);
  }

  async deleteTicket(ticketId: number): Promise<Ticket> {
    const ticket = await this.findOne({
      where: { id: ticketId },
    });
    if (!ticket) {
      throw new NotFoundException(`Ticket with id #${ticketId} not found.`);
    }
    return this.remove(ticket);
  }
}
