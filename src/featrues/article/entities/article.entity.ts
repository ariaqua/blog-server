import { Category } from 'src/featrues/category/entities/category.entity';
import { Comment } from 'src/featrues/comment/entities/comment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  ArticleState,
  CommentState,
} from 'src/featrues/article/enum/article.enum';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 32 })
  title: string;

  @Column({ length: 255 })
  summary: string;

  @Column({ length: 16, nullable: true })
  author: string;

  @CreateDateColumn()
  create_date: Date;

  @UpdateDateColumn()
  update_date: Date;

  @Column({ type: 'enum', enum: ArticleState })
  article_state: ArticleState;

  @Column({ type: 'enum', enum: CommentState, default: CommentState.public })
  comment_state: CommentState;

  @Column({ default: false })
  top: boolean;

  @Column({ length: 128, nullable: true })
  music: string;

  @Column({ default: 0 })
  like: number;

  @Column({ nullable: true })
  pictrue: string;

  @Column({ nullable: true })
  theme: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ length: 120, nullable: true })
  tags: string;

  @ManyToMany(() => Category, (category) => category.articles, {
    cascade: true,
  })
  @JoinTable()
  categories: Category[];

  @OneToMany(() => Comment, (comment) => comment.article)
  conments: Comment[];
}
