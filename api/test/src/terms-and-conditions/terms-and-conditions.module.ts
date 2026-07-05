import { Module } from '@nestjs/common';
import { TermsAndConditionsService } from './terms-and-conditions.service';
import { TermsAndConditionsController } from './terms-and-conditions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TermsAndCondition,
  TermsAndConditionSchema,
} from './entities/terms-and-condition.entity';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TermsAndCondition.name, schema: TermsAndConditionSchema },
    ]),
    UserModule,
  ],
  controllers: [TermsAndConditionsController],
  providers: [TermsAndConditionsService, JwtService],
})
export class TermsAndConditionsModule {}
