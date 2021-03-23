import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join, extname } from 'path';

const MIME_TYPES = {
  image: 'image',
  audio: 'audio',
  video: 'video',
  'text/css': 'css',
};

function getMIMETypedir(mime: string) {
  if (mime !== 'text/css') {
    mime = mime.replace(/\/\w*/, '');
  }
  return MIME_TYPES[mime] ? MIME_TYPES[mime] : 'others';
}

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dir = join(
            this.configService.get<string>('UPLOAD_DIR'),
            getMIMETypedir(file.mimetype),
          );
          cb(null, dir);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, file.fieldname + '-' + uniqueSuffix + ext);
        },
      }),
    };
  }
}
