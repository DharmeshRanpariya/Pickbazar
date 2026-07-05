import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RefundReasonService } from './refund-reason.service';
import { RefundReasonController } from './refund-reason.controller';
import {
  RefundReason,
  RefundReasonSchema,
} from './entities/refund-reason.entity';
import { UserModule } from 'src/users/users.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RefundReason.name, schema: RefundReasonSchema },
    ]),
    UserModule,
  ],
  controllers: [RefundReasonController],
  providers: [RefundReasonService, JwtService],
})
export class RefundReasonModule {}
