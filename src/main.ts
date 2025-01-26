import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

/**
 * 
 * 
 * 
*/

// 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove uma propriedade que não está no DTO
    transform: true // Remove uma propriedade que não está no DTO
  }))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
