import 'reflect-metadata';
import { DataSource } from 'typeorm';

const TestDataSource: DataSource = new DataSource({
  type: 'sqljs',
  database: new Uint8Array(),
  location: 'database',
  logging: false,
  synchronize: true,
  entities: ['src/orm/entity/**/*.ts'],
  migrations: [__dirname + '/migration/*.js'],
  subscribers: [__dirname + '/subscriber/*.js'],
});

export { TestDataSource };
