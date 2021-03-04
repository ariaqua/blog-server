import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Article } from 'src/featrues/article/entities/article.entity';
import { Comment } from '../entities/comment.entity';

export class CreateCommentDto {
  @IsString()
  alia: string;

  @IsString()
  avatar: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @Length(2, 120)
  comment: string;

  @IsNumber()
  @IsOptional()
  parent: Comment;

  @IsNumber()
  @IsOptional()
  deep_reply_id: number;

  @IsString()
  @IsOptional()
  deep_reply_name: string;

  @IsString()
  @IsOptional()
  deep_reply_email: string;

  @IsNumber()
  @IsOptional()
  article: Article;
}