import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // удаляет лишние поля
      forbidNonWhitelisted: true, // бросает ошибку на неизвестные поля
      transform: true, // автоматически преобразует типы (например, string -> number)
    }),
  );
  await app.listen(3000);
  console.log(`User service is running on port ${3000}`);
}
bootstrap();
