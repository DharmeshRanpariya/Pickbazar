import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { Tag, TagSchema } from './entities/tag.entity';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
    UserModule,
  ],
  controllers: [TagController],
  providers: [TagService, JwtService],
})
export class TagModule {}
