import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get configurations
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 4000);
  const productionUrl = configService.get<string>('PRODUCTION_URL');
  const platform = configService.get<string>('PLATFORM_NAME');

  // Swagger configuration
  const swaggerOptions = new DocumentBuilder()
    .setTitle(`${platform} API`)
    .setDescription(`API Documentation for ${platform} API`)
    .setVersion('1.0.0')
    .addServer(`http://localhost:${port}`, 'Local environment')
    .addServer(`https://api.unistudentsmatch.com`, 'Production environment')
    .addServer(`ws://localhost:${port}`, 'Local WebSocket server')
    .addServer(`ws://${productionUrl}:${port}`, 'Production WebSocket server')
    .addBearerAuth(
      { type: 'http', scheme: 'Bearer', bearerFormat: 'JWT' },
      'Authorization',
    )
    .addTag('Server', 'Endpoint for Server functions')
    .addTag('Auth', 'Endpoint for Auth functions')
    .addTag('Categories', 'Endpoint for Categories functions')
    .addTag('Service', 'Endpoint for Service functions')
    .addTag('Store', 'Endpoint for Store functions')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);

  // Setup Swagger at /docs
  SwaggerModule.setup('docs', app, swaggerDocument, {
    customSiteTitle: `${platform} API`,
    swaggerOptions: {
      explorer: false,
      defaultModelsExpandDepth: -1,
      docExpansion: 'list',
      defaultModelRendering: 'model',
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      displayRequestDuration: true,
      jsonEditor: true,
      useUnsafeSource: true,
      deepLinking: true,
    },
    customCss: `
    .swagger-ui .topbar { display: none; }`,
  });

  await app.listen(port);
}

bootstrap();
