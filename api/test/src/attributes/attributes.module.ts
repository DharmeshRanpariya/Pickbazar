import { Module } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { AttributesController } from './attributes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Attribute, AttributeSchema } from './entities/attribute.entity';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Attribute.name, schema: AttributeSchema },
    ]),
    UserModule,
  ],
  controllers: [AttributesController],
  providers: [AttributesService, JwtService],
})
export class AttributesModule {}
