import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { PictureType, FileType } from './enum/album.enum';
import { MulterFile, MulterFileType } from './interface/album.interface';
import { Avatar, AvatarsLenght } from 'src/common/enum/avatar.enum';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: MulterFileType) {
    return this.albumService.upload(file);
  }

  @Post('uploadFile')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: MulterFileType,
    @Body() createAlbum: CreateAlbumDto,
  ) {
    return this.albumService.uploadFile(file, createAlbum);
  }

  @Delete('unlink')
  unlink(@Body('url') url: string) {
    return this.albumService.unlink(url);
  }

  @Public()
  @Get('avatar')
  getAvatar() {
    return Avatar[Math.floor(Math.random() * AvatarsLenght)];
  }

  @Public()
  @Get('validateAvatar')
  validate(@Query('url') url: string) {
    return Avatar[url];
  }

  @Post(':fileType')
  create(
    @Param('fileType') fileType: FileType,
    @Body() createAlbum: CreateAlbumDto,
  ) {
    return this.albumService.create(fileType, createAlbum);
  }

  @Get(':fileType')
  find(
    @Param('fileType') fileType: FileType,
    @Query('pictureType') pictureType: PictureType,
  ) {
    return this.albumService.find(fileType, pictureType);
  }

  @Get(':fileType/:id')
  async findOne(
    @Param('fileType') fileType: FileType,
    @Param('id') id: string,
  ) {
    return this.albumService.findOne(fileType, +id).catch((err) => {
      throw new NotFoundException(err.message);
    });
  }

  @Put(':fileType/:id')
  async update(
    @Param('fileType') fileType: FileType,
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    return this.albumService
      .update(fileType, +id, updateAlbumDto)
      .catch((err) => {
        throw new NotFoundException(err.message);
      });
  }

  @Delete(':fileType/:id')
  async removeOne(
    @Param('fileType') fileType: FileType,
    @Param('id') id: string,
    @Body() multerFile: MulterFile,
  ) {
    return this.albumService
      .removeOne(fileType, +id, multerFile)
      .catch((err) => {
        throw new NotFoundException(err.message);
      });
  }

  @Delete(':fileType')
  removeMany(
    @Param('fileType') fileType: FileType,
    @Body() multerFiles: MulterFile[],
  ) {
    return this.albumService.removeMany(fileType, multerFiles);
  }
}
