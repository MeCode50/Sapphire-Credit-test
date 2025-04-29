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
  const platform = configService.get<string>('SAPPHIRE CREDIT');

  // Swagger configuration
  const swaggerOptions = new DocumentBuilder()
    .setTitle(`Sapphire Credit API`)
    .setDescription(`API Documentation foR sapphire credit`)
    .setVersion('1.0.0')
    .addServer(`http://localhost:${port}`, 'Local environment')
    .addServer(`https://api.unistudentsmatch.com`, 'Production environment')
    .addServer(`ws://localhost:${port}`, 'Local WebSocket server')
    .addServer(`ws://${productionUrl}:${port}`, 'Production WebSocket server')
    // .addBearerAuth(
    //   { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    //   'access-token', // <- security name
    // )
    .addBearerAuth(
      { type: 'http', scheme: 'Bearer', bearerFormat: 'JWT' },
      'Authorization',
    )
    .addTag('Server', 'Endpoint for Server functions')
    .addTag('Auth', 'Endpoint for Auth functions')
    .addTag('Service', 'Endpoint for Service functions')
    .addTag('Store', 'Endpoint for Store functions')
    .addTag('Mbe', 'Endpoint for mbe functions')
    .addTag('Schedule Lock', 'Endpoint for Schedule Lock functions')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);

  // Setup Swagger at /docs
  SwaggerModule.setup('docs', app, swaggerDocument, {
    customSiteTitle: `Sapphire Credit API`,
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
