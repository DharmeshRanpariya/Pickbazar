import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StateAndCityService } from './state-and-city.service';
import { StateAndCityController } from './state-and-city.controller';
import {
  StateAndCity,
  StateAndCitySchema,
} from './entities/state-and-city.entity';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StateAndCity.name, schema: StateAndCitySchema },
    ]),
    UserModule,
  ],
  controllers: [StateAndCityController],
  providers: [StateAndCityService, JwtService],
})
export class StateAndCityModule {}
