import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UploadService } from './upload.service';
import { extname } from 'path';
import { File as MulterFile } from 'multer';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post('docx')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          const ext = extname(file.originalname);
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  )

  async uploadFile(@UploadedFile() file: MulterFile) {
    try {
      const result = await this.uploadService.convertDocxToPdf(file.path);
      return result;
    } catch (error) {
      console.error('Erro no uploadFile controller:', error);
      throw error;
    }
  }
  @Post('xlsx')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async convertXlsx(@UploadedFile() file: MulterFile) {
    const result = await this.uploadService.convertDocxToPdf(file.path);
    return result;
  }
}
