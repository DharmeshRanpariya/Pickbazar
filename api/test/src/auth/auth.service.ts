import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/entities/user.entity';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { VerifyForgetPasswordToken } from './dto/verify-Forget-Password-Token.dto';
import { VerifyEmailToken } from './dto/verifyEmailToken.dto';
import { Resendtoken } from './dto/resendtoken.dto';
import { MailerService } from './mailer.service';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { ChangePasswordDto } from './dto/ChangePassword.dto';
import { SocialLoginDto } from './dto/SocialLoginDto';
import * as twilio from 'twilio';
import { OtpLoginDto } from './dto/OtpLogin.dto';

@Injectable()
export class AuthService {
  private twilioClient: twilio.Twilio;
  private verificationSid: string;
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private configService: ConfigService,
  ) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.verificationSid = this.configService.get<string>(
      'TWILIO_VERIFICATION_SERVICE_ID',
    );
    if (!accountSid || !authToken || !this.verificationSid) {
      throw new Error(
        'Twilio credentials are not set properly in environment variables.',
      );
    }
    this.twilioClient = twilio(accountSid, authToken);
  }

  async requestPasswordReset(requestPasswordResetDto: RequestPasswordResetDto) {
    const user = await this.userModel
      .findOne({ email: requestPasswordResetDto.email })
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = token;

    await user.save();

    this.mailerService.sendMailVerify(
      user.email,
      'mr.lathiyadixit@gmail.com',
      'Password Reset',
      `Here is your password reset token: ${token}`,
    );

    return { success: 'Successful Verify Email' };
  }

  async verifyForgetPasswordToken(
    verifyForgetPasswordToken: VerifyForgetPasswordToken,
  ) {
    const user = await this.userModel
      .findOne({ email: verifyForgetPasswordToken.email })
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const token = user.resetPasswordToken;
    if (token == verifyForgetPasswordToken.token) {
      return { success: 'Successful Verify Token' };
    } else {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userModel
      .findOne({ email: resetPasswordDto.email })
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.resetPasswordToken !== resetPasswordDto.token) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const passwordValidation =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordValidation.test(resetPasswordDto.password)) {
      throw new BadRequestException(
        'Password too weak: must include letters, numbers, and special characters',
      );
    }

    user.password = await bcrypt.hash(resetPasswordDto.password, 12);
    user.resetPasswordToken = undefined;
    await user.save();

    return { success: 'Successful Change Password' };
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      delete user.password;
      return user;
    }

    return null;
  }

  async login(email: string, pass: string) {
    const user = await this.userModel.findOne({ email }).exec();
    if (user.provider === 'google') {
      throw new BadRequestException('This email already login with Google');
    }
    if (!user || !(await bcrypt.compare(pass, user.password))) { 
      throw new BadRequestException('Invalid email or password');
    }
    if (!user.isActive) {
      throw new UnauthorizedException(
        'Your account is inactive. Please contact support.',
      );
    }
    const payload = { email: user.email, sub: user._id };
    return {
      token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(user: User) {
    const passwordValidation =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordValidation.test(user.password)) {
      throw new BadRequestException(
        'Password too      weak: must include letters, numbers, and special characters',
      );
    }
    const existingUser = await this.userModel.findOne({ email: user.email });
    if (existingUser) {
      throw new BadRequestException('This email is already registered');
    }

    user.password = await bcrypt.hash(user.password, 12);
    user.provider = 'email';
    const newUser = new this.userModel(user);
    const verifyEmail = { email: newUser.email };
    const emailToken = this.jwtService.sign(verifyEmail, { expiresIn: '1d' });
    newUser.emailToken = emailToken;
    await newUser.save();
    this.mailerService.sendMailVerify(
      user.email,
      'mr.lathiyadixit@gmail.com',
      'Welcome to Our Service',
      `Hello ${newUser.name},\n\nWelcome to our service! \n this is your registration link \n click on this link to conform \n http://localhost:3003/verify?token=${emailToken}`,
    );
    return {
      user: newUser,
    };
  }

  async verifyEmailToken(verifyEmailToken: VerifyEmailToken) {
    try {
      const decodedToken = await this.jwtService.verifyAsync(
        verifyEmailToken.token,
        {
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      );
      if (!decodedToken) {
        throw new UnauthorizedException('Invalid token');
      }
      const user = await this.userModel
        .findOne({ email: decodedToken.email })
        .exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (user.emailToken !== verifyEmailToken.token) {
        throw new UnauthorizedException('Invalid token');
      }
      user.isVerified = true;
      user.emailToken = null;
      await user.save();
      return { success: 'Email verified successfully' };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      } else {
        throw new UnauthorizedException('Invalid token');
      }
    }
  }

  async resendtoken(resendtoken: Resendtoken) {
    const user = await this.userModel
      .findOne({ email: resendtoken.email })
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const verifyEmail = { email: user.email };
    const emailToken = this.jwtService.sign(verifyEmail, { expiresIn: '1d' });
    user.emailToken = emailToken;
    await user.save();
    this.mailerService.sendMailVerify(
      user.email,
      'mr.lathiyadixit@gmail.com',
      'Verify Your Email',
      `Hello ${user.name},\n\nPlease verify your email by clicking the following link \n: http://localhost:3003/verify?token=${emailToken}`,
    );

    return { success: 'check your email' };
  }

  async changePassword(changePasswordDto: ChangePasswordDto, userId: string) {
    const { oldPassword, newPassword } = changePasswordDto;

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Old password is incorrect');
    }
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return { success: 'Password changed successfully' };
  }

  async socialLogin(socialLoginDto: SocialLoginDto) {
    try {
      const { email, name, provider, image } = socialLoginDto;

      let user = await this.userModel.findOne({ email }).exec();

      if (user) {
        if (!user.isActive) {
          throw new UnauthorizedException(
            'Your account is inactive. Please contact support.',
          );
        }
      }

      if (user) {
        if (
          user.email === email &&
          user.provider === 'google' &&
          provider !== 'google'
        ) {
          throw new BadRequestException(
            'This account is linked with Google. Please log in using Google.',
          );
        }

        if (
          user.email === email &&
          user.provider === 'google' &&
          provider === 'google'
        ) {
          user.photoUrl = {
            original: image,
            thumbnail: image,
          };
          await user.save();
        }
      } else {
        user = new this.userModel({
          name,
          email,
          provider,
          isVerified: true,
          photoUrl: {
            original: image,
            thumbnail: image,
          },
        });
        await user.save();
      }

      const payload = { email: user.email, sub: user._id };
      return { user, token: this.jwtService.sign(payload) };
    } catch (error) {
      console.error('Error in socialLogin:', error);
      throw new InternalServerErrorException(
        'Something went wrong during social login',
      );
    }
  }

  async validateGoogleUser(profile: any) {
    const { email, name, sub } = profile;

    let user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      user = new this.userModel({
        email,
        name,
      });
      await user.save();
    }

    return {
      id: user._id,
      email: user.email,
      name: user.name,
    };
  }

  createToken(user: any) {
    const payload = { email: user.email, sub: user._id };
    return { user, token: this.jwtService.sign(payload) };
  }
  async OtpLogin(otpLoginDto: OtpLoginDto): Promise<any> {
    const { phoneNumber, code } = otpLoginDto;

    try {
      const result = await this.twilioClient.verify.v2
        .services(this.verificationSid)
        .verificationChecks.create({
          to: phoneNumber,
          code,
        });

      if (result.status !== 'approved') {
        throw new BadRequestException('Invalid OTP');
      }

      let user = await this.userModel.findOne({ phoneNumber });

      if (user) {
        const payload = { email: user.email, sub: user._id };
        return {
          token: this.jwtService.sign(payload),
          user,
        };
      } else {
        const newUser = new this.userModel({
          ...otpLoginDto,
          isVerified: true,
          provider: 'phone_number', 
        });
        await newUser.save();

        const payload = { email: newUser?.email, sub: newUser._id };
        return {
          token: this.jwtService.sign(payload),
          newUser,
        };
      }
    } catch (error) {
      throw new BadRequestException('Failed to verify OTP');
    }
  }
}