"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const app_module_1 = require("./app.module");
const express = require("express");
const serverlessExpress = require('@vendia/serverless-express');
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
if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
    async function runLocal() {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        configureApp(app);
        const port = process.env.PORT || 3000;
        await app.listen(port);
        console.log(`Application is running on: http://localhost:${port}/api`);
        console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
    }
    runLocal();
}
//# sourceMappingURL=main.js.map