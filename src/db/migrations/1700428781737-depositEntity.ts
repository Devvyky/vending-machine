import { MigrationInterface, QueryRunner } from "typeorm";

export class DepositEntity1700428781737 implements MigrationInterface {
    name = 'DepositEntity1700428781737'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "deposit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "amount" numeric NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_6654b4be449dadfd9d03a324b61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "deposit" ADD CONSTRAINT "FK_b3f1383d11c01f2b6e63c37575b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deposit" DROP CONSTRAINT "FK_b3f1383d11c01f2b6e63c37575b"`);
        await queryRunner.query(`DROP TABLE "deposit"`);
    }

}
