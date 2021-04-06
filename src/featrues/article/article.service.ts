import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { Category } from '../category/entities/category.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  create(createArticleDto: CreateArticleDto): Promise<Article> {
    return this.articleRepository.save(createArticleDto);
  }

  findAll(skip = 0, take = 10) {
    return this.articleRepository.findAndCount({
      select: [
        'id',
        'title',
        'summary',
        'pictrue',
        'create_date',
        'article_state',
      ],
      relations: ['categories'],
      order: { id: -1 },
      skip,
      take,
    });
  }

  findOne(id: number) {
    return this.articleRepository.findOneOrFail(id, {
      relations: ['categories', 'conments'],
    });
    // return this.articleRepository
    //   .createQueryBuilder('article')
    //   .leftJoinAndSelect('article.categories', 'category')
    //   .leftJoinAndSelect('article.conments', 'comment')
    //   .where('article.id = :id', { id })
    //   .getOneOrFail();
  }

  findByIds(ids: number[]) {
    return this.articleRepository.findByIds(ids);
  }

  async update(id: number, updateArticleDto: UpdateArticleDto): Promise<any> {
    const articleToUpdate = await this.articleRepository.findOneOrFail(id);
    this.articleRepository.merge(articleToUpdate, updateArticleDto);
    return this.articleRepository.save(articleToUpdate);
  }

  async remove(id: number): Promise<Article> {
    const articleToRemove = await this.articleRepository.findOneOrFail(id);
    return this.articleRepository.remove(articleToRemove);
  }
}
