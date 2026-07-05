import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: NestMailerService) {}

  async sendMailVerify(to: string, from: string, subject: string, text: any): Promise<void> {
    await this.mailerService.sendMail({
      to,
      from,
      subject,
      text,  
    });
  }
}
