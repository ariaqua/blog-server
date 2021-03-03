import { Module } from '@nestjs/common';
import { ArticleService } from 'src/featrues/article/article.service';
import { ArticleController } from 'src/featrues/article/article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from 'src/featrues/article/entities/article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article])],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
