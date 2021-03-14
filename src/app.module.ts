import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { ArticleModule } from './featrues/article/article.module';
import { CategoryModule } from './featrues/category/category.module';
import { UserModule } from './featrues/user/user.module';
import { CommentModule } from './featrues/comment/comment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/database.config';
import { AlbumModule } from './featrues/album/album.module';
import { AuthModule } from './featrues/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'uploads'),
      serveRoot: '/uploads/',
    }),
    CoreModule,
    ArticleModule,
    CategoryModule,
    UserModule,
    CommentModule,
    AlbumModule,
    AuthModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
