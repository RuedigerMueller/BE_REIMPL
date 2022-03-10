/* istanbul ignore file */

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors();
  
  const config = new DocumentBuilder()
    .setTitle('Users')
    .setDescription('The users API description')
    .setVersion('1.0')
    .addTag('users')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const userService: UsersService = app.get(UsersService);
  try {
    await userService.findByUsername('Admin');
  } catch {
    userService.create(
      {
        username: 'Admin',
        password: process.env.INITIAL_ADMIN_PASSWORD || 'changeme',
        firstName: 'unknown',
        lastName: 'unknown',
        email: 'admin@example.com',
      },
      true,
    );
  }

  await app.listen(3001);
}
bootstrap();
