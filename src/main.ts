import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as express from 'express';
import * as serverlessExpress from '@vendia/serverless-express';
import { Handler, Context, Callback } from 'aws-lambda';

// Variable to store cached serverless handler
let server: Handler;

/**
 * Configure NestJS application (validation, CORS, Swagger, etc.)
 */
function configureApp(app: INestApplication): void {
  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS
  app.enableCors();

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Aircraft Monitoring System API')
    .setDescription('RESTful API for aircraft technical condition monitoring system')
    .setVersion('1.0')
    .addTag('Telemetry', 'Telemetry data operations')
    .addTag('Aircrafts', 'Aircraft information')
    .addTag('Maintenance', 'Maintenance management')
    .addTag('Alerts', 'Alerts and notifications')
    .addTag('Administration', 'User administration and management')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}

/**
 * Bootstrap serverless handler for Vercel/Lambda
 */
async function bootstrap(): Promise<Handler> {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  
  const app = await NestFactory.create(AppModule, adapter);
  
  // Configure application
  configureApp(app);

  await app.init();
  
  // Build serverless handler function for Vercel/Lambda
  return serverlessExpress({ app: expressApp });
}

/**
 * Export handler function for Vercel
 * Vercel looks for this function to handle serverless requests
 */
export async function handler(
  event: any,
  context: Context,
  callback: Callback,
): Promise<any> {
  // Cache: if function was already initialized, use cached instance
  server = server ?? (await bootstrap());
  return server(event, context, callback);
}

/**
 * Local development: run server normally
 * This code runs only when not in Vercel environment
 */
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  async function runLocal() {
    const app = await NestFactory.create(AppModule);
    
    // Configure application
    configureApp(app);

    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}/api`);
    console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
  }

  runLocal();
}

