import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Model } from 'mongoose';
import { User } from '../users/entities/user.entity';

@Injectable()
export class UploadsService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
    credentials: {
      accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
    },
  });

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async upload(fileName: string, file: Buffer, userId: string, baseUrl?: string) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME'),
        Key: fileName,
        Body: file,
      }),
    );

    const fileUrl = baseUrl
      ? `${baseUrl}/${encodeURIComponent(fileName)}`
      : `https://${this.configService.getOrThrow('AWS_S3_BUCKET_NAME')}.s3.${this.configService.getOrThrow('AWS_S3_REGION')}.amazonaws.com/${fileName}`;

    const photoUrl = {
      thumbnail: fileUrl,
      original: fileUrl,
    };

    return { photoUrl };
  }

  async updatePhoto(fileName: string, file: Buffer, userId: string, baseUrl?: string) {
    return this.upload(fileName, file, userId, baseUrl);
  }

  async deletePhoto(fileName: string, userId: string) {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME'),
        Key: fileName,
      }),
    );

    await this.userModel.findByIdAndUpdate(userId, { $unset: { photoUrl: '' } });

    return { message: 'Photo deleted successfully' };
  }

  async uploadMultiple(files: { fileName: string; file: Buffer }[], userId: string, baseUrl?: string) {
    const photoUrls = await Promise.all(
      files.map(async (file) => {
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME'),
            Key: file.fileName,
            Body: file.file,
          }),
        );

        const url = baseUrl
          ? `${baseUrl}/${encodeURIComponent(file.fileName)}`
          : `https://${this.configService.getOrThrow('AWS_S3_BUCKET_NAME')}.s3.${this.configService.getOrThrow('AWS_S3_REGION')}.amazonaws.com/${file.fileName}`;
        return { thumbnail: url, original: url };
      }),
    );

    await this.userModel.findByIdAndUpdate(userId, { photoUrls });

    return { photoUrls };
  }

  async getFileStream(fileName: string) {
    const command = new GetObjectCommand({
      Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME'),
      Key: fileName,
    });
    const response = await this.s3Client.send(command);
    return {
      stream: response.Body,
      contentType: response.ContentType,
    };
  }
}
