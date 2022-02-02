import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeORMConfigService } from './type-ormconfig/type-ormconfig.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeORMConfigService,
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, TypeORMConfigService],
})
export class AppModule {}
