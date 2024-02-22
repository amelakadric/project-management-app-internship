import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ProjectsService } from '../../projects/services/projects.service';
import { Role } from '../../users/enums/roles.enum';

@Injectable()
export class ProjectMemberGuard implements CanActivate {
  constructor(private projectsService: ProjectsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const projectId = request.params.id;
    const userId = request.user.userId;
    const userRole = request.user.role;

    if (userRole == Role.Admin || !projectId) {
      return true;
    }

    const isUserOnProject = await this.projectsService.isUserOnProject(
      userId,
      projectId,
    );

    if (!isUserOnProject) {
      throw new ForbiddenException(
        `User with id ${userId} is not on project with id ${projectId}.`,
      );
    }

    return true;
  }
}
