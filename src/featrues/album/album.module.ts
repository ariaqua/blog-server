import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumPicture } from './entities/album-picture.entity';
import { AlbumFile } from './entities/album-file.entity';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from 'src/config/file.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlbumPicture, AlbumFile]),
    MulterModule.registerAsync({ useClass: MulterConfigService }),
  ],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
