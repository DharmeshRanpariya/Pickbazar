import { Module } from '@nestjs/common';
import { RefundPolicyService } from './refund-policy.service';
import { RefundPolicyController } from './refund-policy.controller';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/users/users.module';
import {
  RefundPolicy,
  RefundPolicySchema,
} from './entities/refund-policy.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RefundPolicy.name, schema: RefundPolicySchema },
    ]),
    UserModule,
  ],
  controllers: [RefundPolicyController],
  providers: [RefundPolicyService, JwtService],
})
export class RefundPolicyModule {}
