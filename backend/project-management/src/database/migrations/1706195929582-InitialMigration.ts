import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1706195929582 implements MigrationInterface {
  name = 'InitialMigration1706195929582';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE users_gender_enum AS ENUM ('male', 'female');`,
    );
    await queryRunner.query(
      `CREATE TYPE users_role_enum AS ENUM ('employee', 'manager', 'admin');`,
    );

    await queryRunner.query(
      `CREATE TYPE tickets_status_enum AS ENUM ('backlog', 'to do', 'in progress', 'done');`,
    );

    await queryRunner.query(
      `CREATE TYPE tickets_priority_enum AS ENUM (1, 2, 3);`,
    );

    await queryRunner.query(
      `CREATE TYPE tickets_type_enum AS ENUM ('story', 'bug', 'feature', 'task');`,
    );

    await queryRunner.query(
      `CREATE TABLE "projects" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "managerId" integer, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "firstname" character varying NOT NULL, "lastname" character varying NOT NULL, "gender" "public"."users_gender_enum" NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'employee', "phoneNumber" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tickets" ("id" SERIAL NOT NULL, "status" "public"."tickets_status_enum" NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "type" "public"."tickets_type_enum" NOT NULL, "priority" "public"."tickets_priority_enum" NOT NULL, "createdById" integer NOT NULL, "assignedToId" integer, "projectId" integer NOT NULL, CONSTRAINT "PK_343bc942ae261cf7a1377f48fd0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "projects_employees_users" ("projectsId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_eb4db6313923744d49f0797bb9d" PRIMARY KEY ("projectsId", "usersId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_39319b8b04b17353a21ae35c1f" ON "projects_employees_users" ("projectsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fb7eb379a65826dbfbdd47a861" ON "projects_employees_users" ("usersId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ADD CONSTRAINT "FK_239dec66b26610938a98a7b7bd3" FOREIGN KEY ("managerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tickets" ADD CONSTRAINT "FK_41de538b3eed286f53dd678b030" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tickets" ADD CONSTRAINT "FK_7712f291901ceeb504b329df623" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tickets" ADD CONSTRAINT "FK_7ea2738d6dd730beda6fc2f2b46" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects_employees_users" ADD CONSTRAINT "FK_39319b8b04b17353a21ae35c1f1" FOREIGN KEY ("projectsId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects_employees_users" ADD CONSTRAINT "FK_fb7eb379a65826dbfbdd47a8612" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projects_employees_users" DROP CONSTRAINT "FK_fb7eb379a65826dbfbdd47a8612"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects_employees_users" DROP CONSTRAINT "FK_39319b8b04b17353a21ae35c1f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tickets" DROP CONSTRAINT "FK_7ea2738d6dd730beda6fc2f2b46"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tickets" DROP CONSTRAINT "FK_7712f291901ceeb504b329df623"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tickets" DROP CONSTRAINT "FK_41de538b3eed286f53dd678b030"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" DROP CONSTRAINT "FK_239dec66b26610938a98a7b7bd3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fb7eb379a65826dbfbdd47a861"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_39319b8b04b17353a21ae35c1f"`,
    );
    await queryRunner.query(`DROP TABLE "projects_employees_users"`);
    await queryRunner.query(`DROP TABLE "tickets"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "projects"`);
  }
}
