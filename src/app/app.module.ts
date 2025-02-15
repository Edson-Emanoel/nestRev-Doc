import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { TasksModule } from 'src/tasks/tasks.module';
import { UsersModule } from 'src/users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [TasksModule, UsersModule, ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', '..', 'files'), serveRoot: "/files" })],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
