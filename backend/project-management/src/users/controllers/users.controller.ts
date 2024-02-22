import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { User } from '../../database/entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { Ticket } from '../../database/entities/ticket.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../enums/roles.enum';
import { Project } from '../../database/entities/project.entity';
import { ProjectsService } from '../../projects/services/projects.service';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
  getSchemaPath,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private projectService: ProjectsService,
  ) {}

  /**
   * Get all users with the role 'Admin'.
   */
  @ApiOkResponse({
    type: User,
    schema: { $ref: getSchemaPath(User) },
    isArray: true,
    description: 'Successfully retrieves all users',
  })
  @ApiUnauthorizedResponse({ description: 'User has to be logged in.' })
  @ApiForbiddenResponse({
    description: 'User does not have required Admin role.',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.Admin, Role.Manager)
  async getAllUsers(): Promise<{ users: User[] }> {
    const users = await this.userService.getAll();
    return { users: users };
  }

  /**
   * Get users by their role.
   * @param role - The role to filter users by.
   */
  @ApiOkResponse({
    type: User,
    schema: { $ref: getSchemaPath(User) },
    isArray: true,
    description: 'Successfully retrieves all users with certain Role',
  })
  @ApiUnauthorizedResponse({ description: 'User has to be logged in.' })
  @ApiForbiddenResponse({
    description: 'User does not have required Admin role.',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('roles')
  @Roles(Role.Admin)
  async getUsersByRole(@Query('role') role: Role): Promise<{ users: User[] }> {
    const users = await this.userService.getUsersByRole(role);
    return { users: users };
  }

  /**
   * Create a new user.
   * @param userData - The user data for creating a new user.
   */
  @ApiCreatedResponse({
    type: User,
    schema: { $ref: getSchemaPath(User) },
    description: 'Successfully creates a new user.',
  })
  @ApiConflictResponse({
    description: `Email address is already taken.`,
  })
  @Post()
  async create(@Body() userData: CreateUserDto): Promise<{ user: User }> {
    const createdUser = await this.userService.create(userData);
    return { user: createdUser };
  }

  /**
   * Update an existing user by their ID.
   * @param id - The ID of the user to update.
   * @param userData - The updated user data.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({
    type: User,
    schema: { $ref: getSchemaPath(User) },
    description: 'Successfully updates user.',
  })
  @ApiUnauthorizedResponse({ description: 'User has to be logged in.' })
  @ApiForbiddenResponse({
    description: 'User does not have required Admin role.',
  })
  @ApiNotFoundResponse({ description: 'User with id not found' })
  @Patch(':id')
  @Roles(Role.Admin)
  async update(
    @Param('id') id: number,
    @Body() userData: UpdateUserDto,
  ): Promise<{ updatedUser: User }> {
    const updatedUser = await this.userService.update(id, userData);
    return { updatedUser };
  }

  /**
   * Delete a user by their ID.
   * @param id - The ID of the user to delete.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({
    type: User,
    schema: { $ref: getSchemaPath(User) },
    description: 'Successfully deletes user.',
  })
  @ApiUnauthorizedResponse({ description: 'User has to be logged in.' })
  @ApiForbiddenResponse({
    description: 'User does not have required Admin role.',
  })
  @ApiNotFoundResponse({ description: 'User with id not found' })
  @Delete(':id')
  @Roles(Role.Admin)
  async delete(@Param('id') id: number): Promise<{ isDeleted: boolean }> {
    try {
      await this.userService.delete(id);
      return { isDeleted: true };
    } catch (error) {
      throw new NotFoundException({ isDeleted: false });
    }
  }

  /**
   * Get the currently logged-in user.
   */
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: User,
    schema: { $ref: getSchemaPath(User) },
    description: 'Successfully retrieves logged-in user.',
  })
  @ApiUnauthorizedResponse({ description: 'User has to be logged in.' })
  @ApiNotFoundResponse({ description: 'User with id not found' })
  @Get('me')
  async getLoggedInUser(@Req() req): Promise<{ user: User }> {
    const user = await this.userService.getUserById(req.user.userId);
    return { user: user };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @Roles(Role.Admin)
  async getUserById(@Param('id') id: number): Promise<{ user: User }> {
    const user = await this.userService.getUserById(id);
    return { user: user };
  }

  /**
   * Get tickets created by a specific user.
   * @param id - The ID of the user.
   */
  @ApiOkResponse({
    type: Ticket,
    schema: { $ref: getSchemaPath(Ticket) },
    description: 'Successfully retrieves tickets created by certain user.',
  })
  @ApiUnauthorizedResponse({ description: 'User has to be logged in.' })
  @ApiNotFoundResponse({
    description: 'User with id not found. Tickets with creator id not found.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:id/created-tickets')
  async getCreatedTickets(
    @Param('id') id: number,
  ): Promise<{ tickets: Ticket[] }> {
    const tickets = await this.userService.getCreatedTickets(id);
    return { tickets: tickets };
  }

  /**
   * Get tickets assigned to a specific user.
   * @param id - The ID of the user.
   */
  @ApiOkResponse({
    type: Ticket,
    schema: { $ref: getSchemaPath(Ticket) },
    isArray: true,
    description: 'Successfully retrieves tickets assigned to certain user.',
  })
  @ApiUnauthorizedResponse({ description: 'User has to be logged in.' })
  @ApiNotFoundResponse({
    description:
      'User with id not found. Tickets with assigned user id not found.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:id/assigned-tickets')
  async getAssignedTickets(
    @Param('id') id: number,
  ): Promise<{ tickets: Ticket[] }> {
    const tickets = await this.userService.getAssignedTickets(id);
    return { tickets: tickets };
  }

  /**
   * Get projects managed by a specific manager.
   * @param managerId - The ID of the manager.
   */
  @ApiOkResponse({
    type: Ticket,
    schema: { $ref: getSchemaPath(Ticket) },
    isArray: true,
    description: 'Successfully retrieves projectd managed by certain user.',
  })
  @ApiUnauthorizedResponse({ description: 'User has to be logged in.' })
  @ApiForbiddenResponse({
    description: 'User does not have required Manager role.',
  })
  @ApiBadRequestResponse({
    description: 'User with id does not have the required Manager role.',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Manager)
  @Get(':managerId/managed-projects')
  async getManagedProjects(
    @Param('managerId') managerId: number,
  ): Promise<{ projects: Project[] }> {
    const projects =
      await this.projectService.getProjectsByManagerId(managerId);
    return { projects: projects };
  }

  /**
   * Get projects associated with a specific employee.
   * @param userId - The ID of the employee.
   */
  @ApiOkResponse({
    type: Ticket,
    schema: { $ref: getSchemaPath(Ticket) },
    isArray: true,
    description: 'Successfully retrieves projects where user is an employee.',
  })
  @ApiUnauthorizedResponse({ description: 'User has to be logged in.' })
  @ApiForbiddenResponse({
    description: 'User does not have required Employee role.',
  })
  @ApiNotFoundResponse({
    description: 'User with id not found.',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employee)
  @Get(':userId/employments')
  async getEmployments(
    @Param('userId') userId: number,
  ): Promise<{ projects: Project[] }> {
    const projects = await this.userService.getEmployments(userId);
    return { projects: projects };
  }
}
