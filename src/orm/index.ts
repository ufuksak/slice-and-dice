import 'reflect-metadata';
import { DataSource } from 'typeorm';

import {
  redisHost,
  redisPort,
  redisPassword,
  dbType,
  dbHostName,
  dbDBName,
  dbUser,
  dbPassword,
  dbPort,
} from '../config/config';

const AppDataSource: DataSource = new DataSource({
  name: 'default',
  type: dbType,
  host: dbHostName,
  port: parseInt(dbPort ?? '3306'),
  username: dbUser,
  password: dbPassword,
  database: dbDBName,
  synchronize: true,
  logging: false,
  cache: {
    type: 'ioredis',
    options: {
      host: redisHost,
      port: parseInt(redisPort ?? '6379'),
      password: redisPassword,
    },
    ignoreErrors: true,
  },
  entities: ['src/orm/entity/**/*.ts'],
  migrations: [__dirname + '/migration/*.js'],
  subscribers: [__dirname + '/subscriber/*.js'],
});

export { AppDataSource };
