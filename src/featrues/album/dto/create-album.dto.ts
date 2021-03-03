import { IsEnum, IsOptional, IsString } from 'class-validator';
import { FileType, FileState } from '../enum/album.enum';

export class CreateAlbumDto {
  @IsString()
  name: string;

  @IsString()
  url: string;

  @IsEnum(FileState)
  @IsOptional()
  status: FileState;

  @IsString()
  @IsOptional()
  desc: string;

  @IsEnum(FileType)
  fileType: FileType;
}
