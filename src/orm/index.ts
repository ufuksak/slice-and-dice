import 'reflect-metadata';
import { DataSource } from 'typeorm';

const AppDataSource: DataSource = new DataSource({
  type: 'sqljs',
  database: new Uint8Array(),
  location: 'database',
  logging: false,
  synchronize: true,
  entities: ['src/orm/entity/**/*.ts'],
  migrations: [__dirname + '/migration/*.js'],
  subscribers: [__dirname + '/subscriber/*.js'],
});

export { AppDataSource };
