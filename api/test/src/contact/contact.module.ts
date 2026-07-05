import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { Contact, ContactSchema } from './entities/contact.entity';
import { UserModule } from 'src/users/users.module';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }]),
    UserModule,
  ],  
  controllers: [ContactController],
  providers: [ContactService, JwtService],
})
export class ContactModule {}
