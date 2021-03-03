import { Article } from 'src/featrues/article/entities/article.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 8, unique: true })
  category: string;

  @CreateDateColumn()
  create_time: Date;

  @RelationId((category: Category) => category.articles)
  articleIds: number[];

  @ManyToMany(() => Article, (article) => article.categories)
  articles: Article[];
}
