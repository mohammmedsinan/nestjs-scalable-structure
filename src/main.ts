import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config'; // Change import source

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
		type: VersioningType.URI,
		prefix: 'v',
		defaultVersion: '1',
	});

  // Swagger Implementation
  const config = new DocumentBuilder()
    .setTitle('Local SEO Optimiza API')
    .setDescription('The API for Local SEO Optimiza, ')
    .setVersion('0.0.1')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // Get the NestJS ConfigService
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors();
  app.setGlobalPrefix('api');

  await app.listen(configService.get('PORT') || 3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
