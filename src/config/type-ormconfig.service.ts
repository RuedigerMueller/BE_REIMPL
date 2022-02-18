import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import * as PostgressConnectionStringParser from 'pg-connection-string';
import { getConnectionOptions } from 'typeorm';

@Injectable()
export class TypeORMConfigService implements TypeOrmOptionsFactory {
  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    const logger: Logger = new Logger('DB Config');

    // Running on Cloud Foundry?
    if (process.env.VCAP_SERVICES !== undefined) {
      logger.log('Running on Cloud Foundry');
      const vcap_services = JSON.parse(process.env.VCAP_SERVICES);
      return {
        type: 'postgres',
        host: vcap_services['postgresql-db'][0].credentials.hostname,
        port: vcap_services['postgresql-db'][0].credentials.port,
        username: vcap_services['postgresql-db'][0].credentials.username,
        password: vcap_services['postgresql-db'][0].credentials.password,
        database: vcap_services['postgresql-db'][0].credentials.dbname,
        url: vcap_services['postgresql-db'][0].credentials.uri,
        entities: ['dist/**/*.entity.js'],
        synchronize: true,
        migrations: ['migration/*.js'],
        extra: '{ "ssl": true, "rejectUnauthorized": true }',
        ssl: {
          ca: vcap_services['postgresql-db'][0].credentials.sslrootcert,
          cert: vcap_services['postgresql-db'][0].credentials.sslcert,
        },
      };
    }

    // Running on Heroku?
    if (process.env.DATABASE_URL !== undefined) {
      logger.log('Running on Heroku');
      const databaseUrl: string = process.env.DATABASE_URL;
      const connectionOptions =
        PostgressConnectionStringParser.parse(databaseUrl);
      return {
        type: 'postgres',
        host: connectionOptions.host,
        port: parseInt(connectionOptions.port),
        username: connectionOptions.user,
        password: connectionOptions.password,
        database: connectionOptions.database,
        url: databaseUrl,
        entities: ['dist/**/*.entity.js'],
        synchronize: true,
        migrations: ['migration/*.js'],
        ssl: true,
        extra: '{ "ssl": true, "rejectUnauthorized": false }',
      };
    }

    // Running local E2E tests?
    if (process.env.NODE_ENV === 'e2etest') {
      return {
        type: 'better-sqlite3',
        database: 'teste2e.db',
        entities: ['./**/*.entity.ts'],
        synchronize: true,
        migrations: ['migration/*.js'],
      };
    }

    // if not running in Cloud Foundry or on Heroku take the connectionOpions as is which means
    // 1) from ENV variables => used when running in the Cloud
    // 2) from ormconfig.json when running locally
    logger.log(
      'Neither running on Cloud Foundry or Heroku & not running E2E tests locally',
    );
    return await getConnectionOptions();
  }
}
