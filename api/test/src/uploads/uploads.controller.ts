import {
  Controller,
  Post,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Req,
  UseGuards,
  Param,
  Get,
  Res,
} from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { Response } from 'express';

@Controller('attachments')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  private getBaseUrl(request: any): string {
    const protocol = request.protocol;
    const host = request.get('host');
    return `${protocol}://${host}/api/attachments`;
  }

  @Get(':fileName')
  async getFile(
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ) {
    try {
      const { stream, contentType } = await this.uploadsService.getFileStream(fileName);
      if (contentType) {
        res.setHeader('Content-Type', contentType);
      }
      if (stream && typeof (stream as any).pipe === 'function') {
        (stream as any).pipe(res);
      } else {
        res.status(404).send('File not found');
      }
    } catch (error) {
      res.status(404).send('File not found');
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 3000000,
          }),
          new FileTypeValidator({
            fileType: new RegExp(/(jpeg|png|jpg|webp)$/),
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() request: any,
  ) {
    const userId = request.user.sub; 
    
    const result = await this.uploadsService.upload(
      file.originalname,
      file.buffer,
      userId,
      this.getBaseUrl(request),
    );

    return result;
  }

  @Patch('update')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 3000000,
          }),
          new FileTypeValidator({
            fileType: new RegExp(/(jpeg|png|jpg|webp)$/),
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() request: any,
  ) {
    const userId = request.user.sub; 
    const result = await this.uploadsService.updatePhoto(
      file.originalname,
      file.buffer,
      userId,
      this.getBaseUrl(request),
    );

    return result;
  }

  @Delete(':fileName')
  @UseGuards(JwtAuthGuard)
  async deleteFile(
    @Param('fileName') fileName: string,
    @Req() request: any,
  ) {
    const userId = request.user.sub; 
    const result = await this.uploadsService.deletePhoto(fileName, userId);
    return result;
  }

  @Post('multiple')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() request: any,
  ) {
    const userId = request.user.sub; 
    const fileData = files.map((file) => ({
      fileName: file.originalname,
      file: file.buffer,
    }));
  
    const result = await this.uploadsService.uploadMultiple(fileData, userId, this.getBaseUrl(request));
  
    return result;
  }
}
