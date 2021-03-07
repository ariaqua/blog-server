import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { FileState, FileType } from '../enum/album.enum';

export abstract class AlbumBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'char', length: 16, nullable: true })
  name: string;

  @Column({ type: 'char', length: 120 })
  url: string;

  @Column({ type: 'enum', enum: FileState, default: FileState.public })
  state: FileState;

  @Column({ length: 255, nullable: true })
  desc: string;

  @Column({ type: 'enum', enum: FileType })
  fileType: FileType;

  @Column()
  @CreateDateColumn()
  create_date: Date;

  @UpdateDateColumn()
  update_date: Date;

  @VersionColumn()
  version: string;
}
