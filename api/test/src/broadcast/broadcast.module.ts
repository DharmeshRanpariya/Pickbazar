import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BroadcastService } from './broadcast.service';
import { BroadcastController } from './broadcast.controller';
import { Broadcast, BroadcastSchema } from './entities/broadcast.entity';
import { MailerService } from 'src/auth/mailer.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Broadcast.name, schema: BroadcastSchema }]), 
  ],
  controllers: [BroadcastController],
  providers: [BroadcastService, MailerService], 
})
export class BroadcastModule {}
