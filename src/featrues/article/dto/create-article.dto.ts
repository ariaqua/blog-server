import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';
import { Category } from 'src/featrues/category/entities/category.entity';

export class CreateArticleDto {
  @IsString()
  @MaxLength(32)
  title: string;

  @IsString()
  @MaxLength(120)
  summary: string;

  @IsString()
  @MaxLength(16)
  @IsOptional()
  author: string;

  @IsString()
  @IsOptional()
  music: string;

  @IsString()
  pictrue: string;

  @IsString()
  @IsOptional()
  theme: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  tags: string;

  @IsArray()
  categories: Category[];
}
