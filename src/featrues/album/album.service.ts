import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
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
  ) {}

  private getEntity(fielTtype: FileType) {
    return FileType[fielTtype] === FileType.picture ? AlbumPicture : AlbumFile;
  }

  upload(file: MulterFileType) {
    console.log(file);
    return file.path.replace(/.+uploads/, 'uploads');
  }

  unlink(url: string) {
    let unlinkFileStatus = HANDER_SUCCESS;
    try {
      unlinkSync(join(__dirname, '../../', url));
    } catch (error) {
      unlinkFileStatus = HANDER_FAILED;
    }
    return { unlinkFileStatus };
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
        unlinkSync(join(__dirname, '../../', multerFile.url));
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
          unlinkSync(join(__dirname, '../../', file.url));
          unlinkFilesStatus[file.url] = HANDER_SUCCESS;
        } catch (error) {
          unlinkFilesStatus[file.url] = HANDER_FAILED;
        }
      }
    });
    return { removeDataRecord: HANDER_SUCCESS, unlinkFilesStatus };
  }
}
