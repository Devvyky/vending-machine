import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  QueryRunner,
} from 'typeorm';

export interface BaseInterfaceRepository<T> {
  merge(entity: T, data: DeepPartial<T>): T;
  create(data: DeepPartial<T>): T;
  createMany(data: DeepPartial<T>[]): T[];
  save(data: DeepPartial<T>): Promise<T>;
  saveMany(data: DeepPartial<T>[]): Promise<T[]>;
  findOneById(id: string): Promise<T>;
  findByCondition(filterCondition: FindOneOptions<T>): Promise<T>;
  findAll(options?: FindManyOptions<T>): Promise<T[]>;
  remove(data: T): Promise<T>;
  findWithRelations(relations: FindManyOptions<T>): Promise<T[]>;
  preload(entityLike: DeepPartial<T>): Promise<T>;
  queryRunner(): Promise<QueryRunner>;
}
