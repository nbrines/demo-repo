import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
    dotenv.config();
    const app = await NestFactory.create(AppModule);
    
    const port = Number(process.env.PORT) || 3000;
    app.enableCors();

    // 1. Register your route before starting the server
    app.getHttpAdapter().get('/', (req, res) => res.send({ message: 'Server Running Successfully!' }));

    // 2. Use a single listen call bound to 0.0.0.0 for Render
    await app.listen(port, '0.0.0.0');
    console.log(`Server listening on port ${port}`);
}

bootstrap();
