import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Project } from '../../database/entities/project.entity';
import { ProjectsService } from '../services/projects.service';
import { CreateProjectDto } from '../dtos/create-project.dto';
import { CreateTicketDto } from '../../tickets/dtos/createTicket.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../users/enums/roles.enum';
import { ProjectMemberGuard } from '../../auth/guards/project-member.guard';
import { Ticket } from '../../database/entities/ticket.entity';
import { TicketsService } from '../../tickets/services/tickets.service';
import { UpdateTicketDto } from '../../tickets/dtos/updateTicket.dto';
import { Type } from '../../tickets/enums/types.enum';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
@UseGuards(JwtAuthGuard, RolesGuard, ProjectMemberGuard)
@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(
    private projectService: ProjectsService,
    private ticketsService: TicketsService,
  ) {}

  /**
   * Returns all projects
   */
  @ApiOkResponse({
    type: Project,
    schema: { $ref: getSchemaPath(Project) },
    isArray: true,
    description: 'Successfully retrieves all projects',
  })
  @Roles(Role.Admin)
  @Get()
  async getAllProjects(): Promise<{ projects: Project[] }> {
    const projects = await this.projectService.getAll();
    return { projects };
  }

  /**
   * Retrieves a project based on the provided id
   */
  @ApiOkResponse({
    type: Project,
    schema: { $ref: getSchemaPath(Project) },
    description: 'Successfully retrieves a project by given id',
  })
  @ApiForbiddenResponse({
    description: 'User is not a member of the project with the specified id.',
  })
  @Roles(Role.Manager, Role.Employee)
  @Get(':id')
  async getProjectById(@Param('id') id: number): Promise<{ project: Project }> {
    const project = await this.projectService.getById(id);
    return { project };
  }

  /**
   * Creates a new project
   */
  @ApiCreatedResponse({
    type: Project,
    schema: { $ref: getSchemaPath(Project) },
    description: 'Successfully creates a new project.',
  })
  @ApiNotFoundResponse({
    description: 'User with the provided id is not found.',
  })
  @ApiBadRequestResponse({
    description:
      'Invalid role passed. Manager role is required for the manager, and Employee role is required for all of the employees.',
  })
  @Roles(Role.Admin)
  @Post()
  async create(
    @Body() projectData: CreateProjectDto,
  ): Promise<{ project: Project }> {
    const createdProject = await this.projectService.create(projectData);
    return { project: createdProject };
  }

  /**
   * Updates name of the specific project
   */
  @ApiOkResponse({
    type: Project,
    schema: { $ref: getSchemaPath(Project) },
    description: 'Successfully updates the name of the project.',
  })
  @ApiNotFoundResponse({
    description: 'Project or user with the provided id is not found.',
  })
  @Roles(Role.Admin, Role.Manager)
  @Patch(':id/name')
  async updateName(
    @Param('id', ParseIntPipe) projectId: number,
    @Body() updateNameDto: { name: string },
  ): Promise<{ project: Project }> {
    const updatedProject = await this.projectService.updateName(
      projectId,
      updateNameDto.name,
    );
    return { project: updatedProject };
  }

  /**
   * Updates manager of the specific project
   */
  @ApiOkResponse({
    type: Project,
    schema: { $ref: getSchemaPath(Project) },
    description: 'Successfully updates the manager of the project.',
  })
  @ApiNotFoundResponse({
    description: 'Project or user with the provided id is not found.',
  })
  @ApiBadRequestResponse({
    description:
      'User with the provided manager id does not have the required Manager role.',
  })
  @Roles(Role.Admin)
  @Patch(':id/manager/:managerId')
  async updateManager(
    @Param('id', ParseIntPipe) projectId: number,
    @Param('managerId', ParseIntPipe) managerId: number,
  ): Promise<{ project: Project }> {
    const updatedProject = await this.projectService.updateManager(
      projectId,
      managerId,
    );
    return { project: updatedProject };
  }

  /**
   * Adds an employee to a specific project
   */
  @ApiCreatedResponse({
    type: Project,
    schema: { $ref: getSchemaPath(Project) },
    description: 'Successfully adds an employee to the project.',
  })
  @ApiNotFoundResponse({
    description: 'Project or user with the provided id is not found.',
  })
  @ApiBadRequestResponse({
    description:
      'User with the provided employee id does not have the required Employee role.',
  })
  @ApiForbiddenResponse({
    description: 'User is not a member of the project with the specified id.',
  })
  @Roles(Role.Admin, Role.Manager)
  @Post(':id/employees/:userId')
  async addEmployee(
    @Param('id', ParseIntPipe) projectId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<{ project: Project }> {
    const updatedProject = await this.projectService.addEmployee(
      projectId,
      userId,
    );
    return { project: updatedProject };
  }

  /**
   * Removes an employee from a specific project
   */
  @ApiOkResponse({
    type: Project,
    schema: { $ref: getSchemaPath(Project) },
    description: 'Successfully removes an employee from the project.',
  })
  @ApiNotFoundResponse({
    description:
      'Project or user with the provided id is not found, or user with the provided user id is not an employee on this project.',
  })
  @ApiForbiddenResponse({
    description: 'User is not a member of the project with the specified id.',
  })
  @Roles(Role.Admin, Role.Manager)
  @Delete(':id/employees/:userId')
  async removeEmployee(
    @Param('id', ParseIntPipe) projectId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<{ project: Project }> {
    const updatedProject = await this.projectService.removeEmployee(
      projectId,
      userId,
    );
    return { project: updatedProject };
  }

  /**
   * Creates a new ticket and adds it to a specific project
   */
  @ApiCreatedResponse({
    type: Project,
    schema: { $ref: getSchemaPath(Project) },
    description:
      'Successfully creates a new ticket and adds it to the project.',
  })
  @ApiNotFoundResponse({
    description:
      'Project or user with the provided id is not found. This may occur if the user to whom the ticket is being assigned does not exist.',
  })
  @ApiForbiddenResponse({
    description: 'User is not a member of the project with the specified id.',
  })
  @Post(':id/tickets')
  async addTicket(
    @Param('id', ParseIntPipe) projectId: number,
    @Body() createTicketDto: CreateTicketDto,
    @Req() req,
  ): Promise<{ project: Project }> {
    const userId = req.user.userId;
    const updatedProject = await this.projectService.addTicket(
      projectId,
      userId,
      createTicketDto,
    );
    return { project: updatedProject };
  }

  /**
   * Removes a ticket from a specific project and deletes it
   */
  @ApiOkResponse({
    type: Project,
    schema: { $ref: getSchemaPath(Project) },
    description:
      'Successfully removes the specified ticket from the project and deletes it.',
  })
  @ApiNotFoundResponse({
    description:
      'Project with the provided id is not found, or the ticket is not found on the project.',
  })
  @ApiForbiddenResponse({
    description: 'User is not a member of the project with the specified id.',
  })
  @Delete(':id/tickets/:ticketId')
  async removeTicket(
    @Param('id', ParseIntPipe) projectId: number,
    @Param('ticketId', ParseIntPipe) ticketId: number,
  ): Promise<{ project: Project }> {
    const updatedProject = await this.projectService.removeTicket(
      projectId,
      ticketId,
    );
    return { project: updatedProject };
  }

  /**
   * Retrieves a ticket by given id
   */
  @ApiOkResponse({
    type: Ticket,
    schema: { $ref: getSchemaPath(Ticket) },
    description: 'Successfully removes the specified ticket from the project.',
  })
  @ApiNotFoundResponse({
    description:
      'Project with the provided id is not found, or the ticket is not found on the project.',
  })
  @ApiForbiddenResponse({
    description: 'User is not a member of the project with the specified id.',
  })
  @Get(':id/tickets/:ticketId')
  async getTicketById(
    @Param('id') id: number,
    @Param('ticketId') ticketId: number,
  ): Promise<{ ticket: Ticket }> {
    const ticket = await this.ticketsService.getTicketById(id, ticketId);
    return { ticket: ticket };
  }

  /**
   * Assignes a ticket to a certain user
   */
  @ApiOkResponse({
    type: Ticket,
    schema: { $ref: getSchemaPath(Ticket) },
    description:
      'Successfully assigns the ticket to the specified user within the designated project.',
  })
  @ApiForbiddenResponse({
    description:
      'User with the provided id is not on the project with the specified id. The ticket cannot be assigned to someone who is not employeed on the project.',
  })
  @ApiForbiddenResponse({
    description: 'User is not a member of the project with the specified id.',
  })
  @Patch(':id/tickets/:ticketId/users/:userId')
  async assignTicketToUser(
    @Param('id') id: number,
    @Param('ticketId') ticketId: number,
    @Param('userId') userId: number,
  ): Promise<{ ticket: Ticket }> {
    const ticket = await this.projectService.assignTicketToUser(
      id,
      ticketId,
      userId,
    );
    return { ticket: ticket };
  }

  /**
   * Updates a ticket by given id
   */
  @ApiOkResponse({
    type: Ticket,
    schema: { $ref: getSchemaPath(Ticket) },
    description: 'Successfully updates the ticket with the specified id.',
  })
  @ApiNotFoundResponse({
    description:
      'Ticket with the provided id is not found within the project with the specified id.',
  })
  @ApiForbiddenResponse({
    description: 'User is not a member of the project with the specified id.',
  })
  @Patch(':id/tickets/:ticketId')
  async updateTicket(
    @Param('id') id: number,
    @Param('ticketId') ticketId: number,
    @Body() ticketData: UpdateTicketDto,
  ): Promise<{ ticket: Ticket }> {
    const ticket = await this.ticketsService.updateTicket(
      id,
      ticketId,
      ticketData,
    );
    return { ticket: ticket };
  }

  /**
   * Filters tickets for a specific project by title, user id, type. All parameters are optional.
   */
  @ApiOkResponse({
    type: Ticket,
    schema: { $ref: getSchemaPath(Ticket) },
    isArray: true,
    description:
      'Successfully filters tickets for a specific project by title, user id, type.',
  })
  @ApiForbiddenResponse({
    description: 'User is not a member of the project with the specified id.',
  })
  @Get(':projectId/tickets')
  async filterTickets(
    @Param('projectId') id: number,
    @Query('title') title: string,
    @Query('userId') userId: number,
    @Query('ticketType') ticketType: Type,
  ): Promise<{ tickets: Ticket[] }> {
    const tickets = await this.ticketsService.filterTickets(
      id,
      userId,
      ticketType,
      title,
    );
    return { tickets: tickets };
  }
  /**
   * Deletes a project
   */
  @ApiOkResponse({
    type: Project,
    schema: { $ref: getSchemaPath(Project) },
    description: 'Successfully deletes the project with the specified id.',
  })
  @ApiNotFoundResponse({
    description: 'Project with the provided is is not found.',
  })
  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<{ isDeleted: boolean }> {
    try {
      await this.projectService.delete(id);
      return { isDeleted: true };
    } catch (error) {
      throw new NotFoundException({ isDeleted: false });
    }
  }
}
