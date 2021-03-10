import { Article } from 'src/featrues/article/entities/article.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  alia: string;

  @Column()
  avatar: string;

  @Column({ nullable: true })
  email: string;

  @CreateDateColumn()
  date: Date;

  @Column({ default: true })
  status: boolean;

  @Column({ length: 120 })
  comment: string;

  @Column({ nullable: true })
  deep_reply_id: number;

  @Column({ nullable: true })
  deep_reply_alia: string;

  @Column({ nullable: true })
  deep_reply_email: string;

  @OneToMany(() => Comment, (comment) => comment.parent)
  children: Comment[];

  @ManyToOne(() => Comment, (comment) => comment.children)
  parent: Comment;

  @ManyToOne(() => Article, (article) => article.conments)
  article: Article;
}
