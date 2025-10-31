import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';  
import { databaseConfig } from './config/database.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { UploadModule } from './upload/upload.module';
import { ParticipationsModule } from './participations/participations.module';

@Module({
    imports:[
        MongooseModule.forRoot(databaseConfig.uri, databaseConfig.options),
        AuthModule,
        EventsModule,
        UploadModule,
        ParticipationsModule,     
    ],
    controllers:[AppController],
    providers:[AppService],
})
export class AppModule {}

