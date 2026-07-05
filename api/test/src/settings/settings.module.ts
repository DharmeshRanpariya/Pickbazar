import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { Setting, SettingtSchema } from './entities/setting.entity';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Setting.name, schema: SettingtSchema }]),
    UserModule,
  ],
  controllers: [SettingsController],
  providers: [SettingsService, JwtService],
})
export class SettingsModule {}
