import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProjectService } from './project.service';
import { Genders } from '../enums/genders.enum';
import { Roles } from '../enums/roles.enum';
import { environment } from '../../environment/environment';
import { ProjectModel } from '../models/project.model';

describe('ProjectService', () => {
  let service: ProjectService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectService],
    });

    service = TestBed.inject(ProjectService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('gets projects successfully', () => {
    const expectedProjects = [{ id: 1, name: 'Project 1', manager:
        {id: 1,
          firstname: 'Name',
          lastname: 'Surname',
          phoneNumber: '',
          gender: Genders.MALE,
          email: 'email@gmail.com',
          password: 'password123', role: Roles.EMPLOYEE}, tickets: [], employees:[] },
      { id: 2, name: 'Project 2', manager:
          {id: 1,
            firstname: 'Name',
            lastname: 'Surname',
            phoneNumber: '',
            gender: Genders.MALE,
            email: 'email@gmail.com',
            password: 'password123', role: Roles.EMPLOYEE}, tickets: [], employees:[] }];

    service.getAllProjects().subscribe((projects) => {
      expect(projects).toEqual(expectedProjects);
    });

    const req = httpTestingController.expectOne(environment.backendServerUrl + '/projects');

    req.flush({ projects: expectedProjects });
    httpTestingController.verify();
  });

  it('handles error on getAllProjects failure', () => {
    const errorResponse = { status: 404, statusText: 'Not Found' };
    const errorMessage = 'Http failure response for http://localhost:3000/projects: 404 Not Found';

    service.getAllProjects().subscribe(
      () => fail('Expected an error, but the request succeeded'),
      (error) => {
        expect(error.message).toEqual(errorMessage);
      }
    );

    const req = httpTestingController.expectOne(environment.backendServerUrl + '/projects');
    expect(req.request.method).toBe('GET');
    req.flush({}, errorResponse);
  });

  it('creates project successfully and navigate to "projects"', () => {
    const mockProject = { id: 1, name: 'Project 1', manager:
        {id: 1,
          firstname: 'Name',
          lastname: 'Surname',
          phoneNumber: '',
          gender: Genders.MALE,
          email: 'email@gmail.com',
          password: 'password123', role: Roles.EMPLOYEE}, tickets: [], employees:[] };

    const mockResponse = { project: mockProject };

    spyOn(service['router'], 'navigate').and.stub();

    service.createProject('Test Project', 1, [2, 3]).subscribe((project) => {
      expect(project).toEqual(mockProject);
      expect(service['router'].navigate).toHaveBeenCalledWith(['projects']);
    });

    const req = httpTestingController.expectOne(environment.backendServerUrl + '/projects');
    req.flush(mockResponse);
  });

  it('handles error when creating project', () => {
    const mockError: string = 'Error creating project' ;

    spyOn(service, 'openMessageDialog').and.stub();

    service.createProject('Test Project', 1, [2, 3]).subscribe((project) => {
      expect(project).toBeUndefined();
      expect(service.openMessageDialog).toHaveBeenCalledWith(mockError);
    });

    const req = httpTestingController.expectOne(environment.backendServerUrl + '/projects');
    req.error(new ErrorEvent('Network error', { message: mockError }));
  });

  it('returns projects on getProjectsById success', () => {
    const userId = 1;
    const projectsData: { projects: ProjectModel[] } = { projects: [{ id: 1, name: 'Project 1', manager:
          {id: 1,
            firstname: 'Name',
            lastname: 'Surname',
            phoneNumber: '',
            gender: Genders.MALE,
            email: 'email@gmail.com',
            password: 'password123', role: Roles.EMPLOYEE}, tickets: [], employees:[] },
        { id: 2, name: 'Project 2', manager:
            {id: 1,
              firstname: 'Name',
              lastname: 'Surname',
              phoneNumber: '',
              gender: Genders.MALE,
              email: 'email@gmail.com',
              password: 'password123', role: Roles.EMPLOYEE}, tickets: [], employees:[] }] };

    service.getProjectsById(userId).subscribe((projects) => {
      expect(projects).toEqual(projectsData.projects);
    });

    const req = httpTestingController.expectOne(`${environment.backendServerUrl}/users/${userId}/employments`);
    expect(req.request.method).toBe('GET');
    req.flush(projectsData);
  });

  it('handles error on getProjectsById failure', () => {
    const userId = 1;
    const errorResponse = { status: 404, statusText: 'Not Found' };
    const errorMessage = 'Http failure response for http://localhost:3000/users/1/employments: 404 Not Found';

    service.getProjectsById(userId).subscribe(
      () => fail('Expected an error, but the request succeeded'),
      (error) => {
        expect(error.message).toEqual(errorMessage);
      }
    );

    const req = httpTestingController.expectOne(`${environment.backendServerUrl}/users/${userId}/employments`);
    expect(req.request.method).toBe('GET');
    req.flush({}, errorResponse);
  });

  it('returns project on getProject success', () => {
    const projectId = 1;
    const projectData: { project: ProjectModel } = { project: { id: 2, name: 'Project 2', manager:
          {id: 1,
            firstname: 'Name',
            lastname: 'Surname',
            phoneNumber: '',
            gender: Genders.MALE,
            email: 'email@gmail.com',
            password: 'password123', role: Roles.EMPLOYEE}, tickets: [], employees:[] } };

    service.getProject(projectId).subscribe((project) => {
      expect(project).toEqual(projectData.project);
    });

    const req = httpTestingController.expectOne(environment.backendServerUrl + '/projects/' + projectId);
    expect(req.request.method).toBe('GET');
    req.flush(projectData);
  });

  it('handles error on getProject failure', () => {
    const projectId = 1;
    const errorResponse = { status: 404, statusText: 'Not Found' };
    const errorMessage = 'Http failure response for http://localhost:3000/projects/1: 404 Not Found';

    service.getProject(projectId).subscribe(
      () => fail('Expected an error, but the request succeeded'),
      (error) => {
        expect(error.message).toEqual(errorMessage);
      }
    );

    const req = httpTestingController.expectOne(environment.backendServerUrl + '/projects/' + projectId);
    expect(req.request.method).toBe('GET');
    req.flush({}, errorResponse);
  });

  it('returns isDeleted on removeProject success', () => {
    const projectId = 1;
    const isDeletedData: { isDeleted: boolean } = { isDeleted: true };

    service.removeProject(projectId).subscribe((isDeleted) => {
      expect(isDeleted).toEqual(isDeletedData.isDeleted);
    });

    const req = httpTestingController.expectOne(environment.backendServerUrl + '/projects/' + projectId); // Updated URL
    expect(req.request.method).toBe('DELETE');
    req.flush(isDeletedData);
  });

  it('updates project name and navigate to projects on success', () => {
    const projectId = 1;
    const name = 'New Project Name';
    const updatedProject = { id: 2, name: 'New Project Name', manager:
        {id: 1,
          firstname: 'Name',
          lastname: 'Surname',
          phoneNumber: '',
          gender: Genders.MALE,
          email: 'email@gmail.com',
          password: 'password123', role: Roles.EMPLOYEE}, tickets: [], employees:[] };

    service.updateProjectName(projectId, name).subscribe((project) => {
      expect(project).toEqual(updatedProject);
    });

    const req = httpTestingController.expectOne(environment.backendServerUrl + '/projects/' + projectId + '/name');
    expect(req.request.method).toBe('PATCH');
    req.flush({ project: updatedProject });
  });

  it('handles error when updating project name', () => {
    const projectId = 1;
    const name = 'New Project Name';

    service.updateProjectName(projectId, name).subscribe((project) => {
      expect(project).toBeUndefined();
    });

    const req = httpTestingController.expectOne(environment.backendServerUrl + '/projects/' + projectId + '/name');
    expect(req.request.method).toBe('PATCH');
    req.flush({ error: { message: 'Error updating project name' } }, { status: 500, statusText: 'Internal Server Error' });
  });

  it('updates project manager on success', () => {
    const projectId = 1;
    const managerId = 42;
    const updatedProject: ProjectModel = { id: 2, name: 'New Project Name', manager:
        {id: 42,
          firstname: 'Name',
          lastname: 'Surname',
          phoneNumber: '',
          gender: Genders.MALE,
          email: 'email@gmail.com',
          password: 'password123', role: Roles.EMPLOYEE}, tickets: [], employees:[] };

    service.updateManager(projectId, managerId).subscribe((project) => {
      expect(project).toEqual(updatedProject);
    });

    const req = httpTestingController.expectOne(environment.backendServerUrl + '/projects/' + projectId + '/manager/' + managerId);
    expect(req.request.method).toBe('PATCH');
    req.flush({ project: updatedProject });
  });

  it('handles error when updating project manager', () => {
    const projectId = 1;
    const managerId = 42;

    service.updateManager(projectId, managerId).subscribe((project) => {
      expect(project).toBeUndefined();
    });

    const req = httpTestingController.expectOne(environment.backendServerUrl + '/projects/' + projectId + '/manager/' + managerId);
    expect(req.request.method).toBe('PATCH');
    req.flush({ error: { message: 'Error updating project manager' } }, { status: 500, statusText: 'Internal Server Error' });
  });

  it('adds employee to project on success', () => {
    const projectId = 1;
    const employeeId = 42;
    const updatedProject: ProjectModel = { id: 2, name: 'New Project Name', manager:
        {id: 1,
          firstname: 'Name',
          lastname: 'Surname',
          phoneNumber: '',
          gender: Genders.MALE,
          email: 'email@gmail.com',
          password: 'password123', role: Roles.EMPLOYEE}, tickets: [], employees:[{id: 42,
        firstname: 'Name',
        lastname: 'Surname',
        phoneNumber: '',
        gender: Genders.MALE,
        email: 'email@gmail.com',
        password: 'password123', role: Roles.EMPLOYEE}] };

    service.addEmployee(projectId, employeeId).subscribe((project) => {
      expect(project).toEqual(updatedProject);
    });

    const req = httpTestingController.expectOne(environment.backendServerUrl + '/projects/' + projectId + '/employees/' + employeeId);
    expect(req.request.method).toBe('POST');
    req.flush({ project: updatedProject });
  });

  it('handles error when adding employee to project', () => {
    const projectId = 1;
    const employeeId = 42;

    service.addEmployee(projectId, employeeId).subscribe((project) => {
      expect(project).toBeUndefined();
    });

    const req = httpTestingController.expectOne(environment.backendServerUrl + '/projects/' + projectId + '/employees/' + employeeId);
    expect(req.request.method).toBe('POST');
    req.flush({ error: { message: 'Error adding employee to project' } }, { status: 500, statusText: 'Internal Server Error' });
  });

  it('removes employee from project on success', () => {
    const projectId = 1;
    const employeeId = 42;
    const updatedProject: ProjectModel = { id: 2, name: 'New Project Name', manager:
        {id: 1,
          firstname: 'Name',
          lastname: 'Surname',
          phoneNumber: '',
          gender: Genders.MALE,
          email: 'email@gmail.com',
          password: 'password123', role: Roles.EMPLOYEE}, tickets: [], employees:[] };

    service.removeEmployee(projectId, employeeId).subscribe((project) => {
      expect(project).toEqual(updatedProject);
    });

    const req = httpTestingController.expectOne(environment.backendServerUrl + '/projects/' + projectId + '/employees/' + employeeId);
    expect(req.request.method).toBe('DELETE');
    req.flush({ project: updatedProject });
  });

  it('handles error when removing employee from project', () => {
    const projectId = 1;
    const employeeId = 42;

    service.removeEmployee(projectId, employeeId).subscribe((project) => {
      expect(project).toBeUndefined();
    });

    const req = httpTestingController.expectOne(environment.backendServerUrl + '/projects/' + projectId + '/employees/' + employeeId);
    expect(req.request.method).toBe('DELETE');
    req.flush({ error: { message: 'Error removing employee from project' } }, { status: 500, statusText: 'Internal Server Error' });
  });

  it('gets projects by manager on success', () => {
    const managerId = 1;
    const projects: ProjectModel[] = [{ id: 1, name: 'Project 1', manager:
        {id: 1,
          firstname: 'Name',
          lastname: 'Surname',
          phoneNumber: '',
          gender: Genders.MALE,
          email: 'email@gmail.com',
          password: 'password123', role: Roles.EMPLOYEE}, tickets: [], employees:[] },
      { id: 2, name: 'Project 2', manager:
          {id: 1,
            firstname: 'Name',
            lastname: 'Surname',
            phoneNumber: '',
            gender: Genders.MALE,
            email: 'email@gmail.com',
            password: 'password123', role: Roles.EMPLOYEE}, tickets: [], employees:[] }];

    service.getProjectsByManager(managerId).subscribe((resultProjects) => {
      expect(resultProjects).toEqual(projects);
    });

    const req = httpTestingController.expectOne(environment.backendServerUrl + /users/ + managerId + '/managed-projects');
    expect(req.request.method).toBe('GET');
    req.flush({ projects });
  });
});
