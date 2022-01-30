import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeORMConfigService } from './type-ormconfig/type-ormconfig.service';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeORMConfigService,      
    }),
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService, TypeORMConfigService],
})
export class AppModule {}
