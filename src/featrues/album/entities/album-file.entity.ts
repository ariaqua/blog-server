import { Entity } from 'typeorm';
import { AlbumBase } from './album-base.entity';

@Entity()
export class AlbumFile extends AlbumBase {}
