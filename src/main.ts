import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove uma propriedade que não está no DTO
      // transform: true // Remove uma propriedade que não está no DTO
    }),
  );

  const configSwagger = new DocumentBuilder()
    .setTitle('Lista de Tarefas')
    .setDescription('API sobre tarefas.')
    .setVersion('1.0')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('docsApi', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
