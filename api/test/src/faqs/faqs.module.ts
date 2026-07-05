import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FaqsService } from './faqs.service';
import { FaqsController } from './faqs.controller';
import { Faq, FaqSchema } from './entities/faq.entity';
import { UserModule } from 'src/users/users.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Faq.name, schema: FaqSchema }]),
    UserModule,
  ],
  controllers: [FaqsController],
  providers: [FaqsService, JwtService],
})
export class FaqsModule {}
