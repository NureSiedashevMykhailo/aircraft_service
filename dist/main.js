"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const express = require("express");
const app_module_1 = require("./app.module");
const serverlessExpressModule = require('@vendia/serverless-express');
const serverlessExpress = serverlessExpressModule.configure || serverlessExpressModule;
let server;
function configureApp(app) {
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors();
    app.setGlobalPrefix('api');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Aircraft Monitoring System API')
        .setDescription('RESTful API for aircraft technical condition monitoring system')
        .setVersion('1.0')
        .addTag('Telemetry', 'Telemetry data operations')
        .addTag('Aircrafts', 'Aircraft information')
        .addTag('Maintenance', 'Maintenance management')
        .addTag('Alerts', 'Alerts and notifications')
        .addTag('Administration', 'User administration and management')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
}
async function bootstrap() {
    const expressApp = express();
    const adapter = new platform_express_1.ExpressAdapter(expressApp);
    const app = await core_1.NestFactory.create(app_module_1.AppModule, adapter);
    configureApp(app);
    await app.init();
    return serverlessExpress({ app: expressApp });
}
async function handler(event, context, callback) {
    server = server ?? (await bootstrap());
    return server(event, context, callback);
}
exports.default = handler;
if (!process.env.VERCEL) {
    async function runServer() {
        try {
            console.log('Starting Nest.js application...');
            console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
            console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? '***configured***' : 'NOT SET'}`);
            const app = await core_1.NestFactory.create(app_module_1.AppModule);
            configureApp(app);
            const port = process.env.PORT || 3000;
            const host = process.env.HOSTNAME || '0.0.0.0';
            await app.listen(port, host);
            console.log(`✅ Application is running on: http://${host}:${port}/api`);
            console.log(`📚 Swagger documentation: http://${host}:${port}/api/docs`);
        }
        catch (error) {
            console.error('❌ Failed to start server:', error);
            process.exit(1);
        }
    }
    runServer();
}
//# sourceMappingURL=main.js.map