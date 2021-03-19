import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class RemoveCommentDto {
  @IsNumber()
  id: number;

  @IsBoolean()
  @IsOptional()
  isFirstComment: boolean;
}
