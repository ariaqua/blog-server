import { Entity, Column } from 'typeorm';
import { AlbumBase } from './album-base.entity';
import { PictureType } from '../enum/album.enum';

@Entity()
export class AlbumPicture extends AlbumBase {
  @Column({ type: 'enum', enum: PictureType })
  pictureType: PictureType;
}
