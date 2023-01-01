import Database from 'src/configs/Database';
import { QueryRunner, Repository } from 'typeorm';

const dataSource = Database.instance.getDataSource('default');

export const startConnect = async () => {
  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.connect();

  await queryRunner.startTransaction();

  return queryRunner;
};

export const save = async (
  repository: Repository<object>,
  request: object,
  queryRunner: QueryRunner
) => {
  try {
    const data = await queryRunner.manager
      .withRepository(repository)
      .save(request);
    return data;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  }
};

export const commitTransaction = async (queryRunner: QueryRunner) => {
  try {
    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};
