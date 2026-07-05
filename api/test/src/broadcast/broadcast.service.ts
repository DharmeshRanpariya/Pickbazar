import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBroadcastDto } from './dto/create-broadcast.dto';
import { UpdateBroadcastDto } from './dto/update-broadcast.dto';
import { Broadcast } from './entities/broadcast.entity';
import { MailerService } from 'src/auth/mailer.service';

@Injectable()
export class BroadcastService {
  constructor(
    @InjectModel(Broadcast.name) private readonly broadcastModel: Model<Broadcast>,
    private readonly mailerService: MailerService,
  ) {}

  async create(createBroadcastDto: CreateBroadcastDto) {
    const broadcast = new this.broadcastModel(createBroadcastDto);
    return await broadcast.save();
  }

  async findAll() {
    return await this.broadcastModel.find().exec();
  }

  async findOne(id: string) {
    const broadcast = await this.broadcastModel.findById(id).exec();
    if (!broadcast) {
      throw new NotFoundException(`Broadcast with id ${id} not found`);
    }
    return broadcast;
  }

  async update(id: string, updateBroadcastDto: UpdateBroadcastDto) {
    return await this.broadcastModel.findByIdAndUpdate(id, updateBroadcastDto, {
      new: true,
    }).exec();
  }

  async remove(id: string) {
    const result = await this.broadcastModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Broadcast with id ${id} not found`);
    }
    return result;
  }

  async sendBroadcastEmail(subject: string, message: string) {
    const broadcasts = await this.broadcastModel.find().exec();

    if (!broadcasts.length) {
      throw new NotFoundException('No email addresses found for broadcasting');
    }

    const emails = broadcasts.map(broadcast => broadcast.email);

    for (const email of emails) {
      await this.mailerService.sendMailVerify(email, 'mr.lathiyadixit@gmail.com', subject, message);
    }

    return { message: `Broadcast email sent to ${emails.length} recipients` };
  }
}
