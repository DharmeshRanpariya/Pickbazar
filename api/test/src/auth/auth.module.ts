import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose'; 
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../users/users.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { User, UserSchema } from '../users/entities/user.entity'; 
import { MailerService } from './mailer.service';
import { GoogleOAuthService } from 'src/guard/google-oauth.strategy';


@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string | number>('JWT_EXPIRE') },
      }),
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), 
    UserModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'mr.lathiyadixit@gmail.com',
          pass: 'vbzymoitdbmhzlvx',
        },
      },
      defaults: {
        from: 'mr.lathiyadixit@gmail.com',
      },
    }),
  ],
  providers: [AuthService, MailerService,GoogleOAuthService],
  controllers: [AuthController],
  exports: [MailerService], 
})
export class AuthModule {}
