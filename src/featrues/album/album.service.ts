import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { unlinkSync } from 'fs';
import { join } from 'path';

import { AlbumPicture } from './entities/album-picture.entity';
import { AlbumFile } from './entities/album-file.entity';
import { FileType, PictureType } from './enum/album.enum';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { MulterFile, MulterFileType } from './interface/album.interface';
import { HANDER_FAILED, HANDER_SUCCESS } from './album.contant';

@Injectable()
export class AlbumService {
  constructor(
    @InjectEntityManager()
    private readonly albumManager: EntityManager,
    private readonly configService: ConfigService,
  ) {}

  private getEntity(fielTtype: FileType) {
    return FileType[fielTtype] === FileType.picture ? AlbumPicture : AlbumFile;
  }

  upload(file: MulterFileType) {
    return file.path.replace(/.+uploads/, '/uploads').replace(/\\/g, '/');
  }

  uploadFile(file: MulterFileType, createAlbumDto: CreateAlbumDto) {
    const fileType = createAlbumDto.fileType;
    createAlbumDto.url = file.path
      .replace(/.+uploads/, '/uploads')
      .replace(/\\/g, '/');
    return this.albumManager.save(this.getEntity(fileType), createAlbumDto);
  }

  unlink(url: string) {
    try {
      unlinkSync(
        join(this.configService.get<string>('UPLOAD_DIR'), '../', url),
      );
    } catch (error) {
      throw new NotFoundException();
    }
    return { unlinkFileStatus: HANDER_SUCCESS };
  }

  create(fileType: FileType, createAlbumDto: CreateAlbumDto) {
    return this.albumManager.save(this.getEntity(fileType), createAlbumDto);
  }

  find(fileType: FileType, pictureType: PictureType) {
    const options: any = { fileType: FileType[fileType] };
    if (pictureType) options.pictureType = pictureType;

    return this.albumManager.find(this.getEntity(fileType), {
      where: options,
    });
  }

  findOne(fileType: FileType, id: number) {
    return this.albumManager.findOneOrFail(this.getEntity(fileType), id, {
      where: { fileType: FileType[fileType] },
    });
  }

  async update(fileType: FileType, id: number, updateAlbumDto: UpdateAlbumDto) {
    const updateToFile = await this.albumManager.findOneOrFail(
      this.getEntity(fileType),
      id,
    );
    Object.assign(updateToFile, updateAlbumDto);
    return this.albumManager.save(updateToFile);
  }

  async removeOne(fileType: FileType, id: number, multerFile: MulterFile) {
    const removeToFile = await this.albumManager.findOneOrFail(
      this.getEntity(fileType),
      id,
    );
    this.albumManager.remove(removeToFile);

    let unlinkFileStatus = HANDER_SUCCESS;
    if (multerFile.url) {
      try {
        unlinkSync(
          join(
            this.configService.get<string>('UPLOAD_DIR'),
            '../',
            multerFile.url,
          ),
        );
      } catch (error) {
        unlinkFileStatus = HANDER_FAILED;
      }
    }
    return { removeDataRecord: HANDER_SUCCESS, unlinkFileStatus };
  }

  async removeMany(fileType: FileType, multerFiles: MulterFile[]) {
    const ids = [];
    multerFiles.forEach((file) => {
      ids.push(file.id);
    });
    const removeToFile = await this.albumManager.findByIds(
      this.getEntity(fileType),
      ids,
    );
    this.albumManager.remove(removeToFile);

    const unlinkFilesStatus: any = {};
    multerFiles.forEach((file) => {
      if (file.url) {
        try {
          unlinkSync(
            join(this.configService.get<string>('UPLOAD_DIR'), '../', file.url),
          );
          unlinkFilesStatus[file.url] = HANDER_SUCCESS;
        } catch (error) {
          unlinkFilesStatus[file.url] = HANDER_FAILED;
        }
      }
    });
    return { removeDataRecord: HANDER_SUCCESS, unlinkFilesStatus };
  }
}
