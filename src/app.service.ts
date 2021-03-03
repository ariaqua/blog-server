import { Injectable } from '@nestjs/common';
import { ArticleService } from './featrues/article/article.service';

@Injectable()
export class AppService {
  constructor(private readonly articleService: ArticleService) {}

  getIndex() {
    const articles = this.articleService.findAll();
    return articles;
  }

  getDetail(id: number) {
    const article = this.articleService.findOne(id);
    return article;
  }
}
