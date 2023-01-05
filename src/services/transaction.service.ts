import Database from 'src/configs/Database';

const dataSource = Database.instance.getDataSource('default');
const startConnect = async () => {
  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.connect();

  await queryRunner.startTransaction();

  return queryRunner;
};

export default startConnect;
