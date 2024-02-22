import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import {
  validationSchema,
  validationOptions,
} from './config/validation.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';
import { ProjectsModule } from './projects/projects.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    TicketsModule,
    AuthModule,
    ConfigModule.forRoot({
      validationSchema,
      validationOptions,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => typeOrmConfig(),
    }),
    UsersModule,
    TicketsModule,
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
