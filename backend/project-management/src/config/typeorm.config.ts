import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Project } from 'src/database/entities/project.entity';
import { Ticket } from 'src/database/entities/ticket.entity';
import { User } from 'src/database/entities/user.entity';
export const typeOrmConfig = (): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [User, Ticket, Project],
    migrations: [],
    logging: true,
    synchronize: false,
  };
};
