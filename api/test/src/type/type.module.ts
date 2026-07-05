import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeService } from './type.service';
import { TypeController } from './type.controller';
import { Type, TypeSchema } from './entities/type.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Type.name, schema: TypeSchema }]), // Register the Type schema
  ],
  controllers: [TypeController],
  providers: [TypeService],
})
export class TypeModule {}
