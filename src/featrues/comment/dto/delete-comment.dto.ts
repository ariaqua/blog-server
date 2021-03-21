import { IsNumber, IsOptional } from 'class-validator';

export class DeleteCommentDto {
  @IsNumber()
  id: number;

  @IsNumber()
  @IsOptional()
  parent: number;
}
