import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { TypeORMConfigService } from './type-ormconfig/type-ormconfig.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConfiguration } from './auth/authConfiguration';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeORMConfigService,
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AuthService, 
    TypeORMConfigService, 
  ],
})
export class AppModule {}
