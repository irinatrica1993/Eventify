import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';  
import { databaseConfig } from './config/database.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports:[
        MongooseModule.forRoot(databaseConfig.uri, databaseConfig.options),     
    ],
    controllers:[AppController],
    providers:[AppService],
})
export class AppModule {}

