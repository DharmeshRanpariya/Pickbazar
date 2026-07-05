import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Req,
  UseGuards,
  Get,
  Redirect,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyForgetPasswordToken } from './dto/verify-Forget-Password-Token.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/entities/user.entity';
import { VerifyEmailToken } from './dto/verifyEmailToken.dto';
import { Resendtoken } from './dto/resendtoken.dto';
import { ChangePasswordDto } from './dto/ChangePassword.dto';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { GoogleOAuthService } from '../guard/google-oauth.strategy';
import { SocialLoginDto } from './dto/SocialLoginDto';
import { find } from 'rxjs';
import { OtpLoginDto } from './dto/OtpLogin.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly googleOAuthService: GoogleOAuthService,
  ) {}

  @Post('request-password-reset')
  async requestPasswordReset(
    @Body() requestPasswordResetDto: RequestPasswordResetDto,
  ) {
    return this.authService.requestPasswordReset(requestPasswordResetDto);
  }

  @Post('verifyForgetPasswordToken')
  async verifyForgetPasswordToken(
    @Body() verifyForgetPasswordToken: VerifyForgetPasswordToken,
  ) {
    return this.authService.verifyForgetPasswordToken(
      verifyForgetPasswordToken,
    );
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
      return await this.authService.login(email, password);
    
  }

  @Post('register')
  async register(@Body() user: User) {
    return this.authService.register(user);
  }
  @Post('verify-email-token')
  async verifyEmailToken(@Body() verifyEmailToken: VerifyEmailToken) {
    return this.authService.verifyEmailToken(verifyEmailToken);
  }
  @Post('resend-verify-token')
  async resendtoken(@Body() resendtoken: Resendtoken) {
    return this.authService.resendtoken(resendtoken);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    return this.authService.changePassword(changePasswordDto, userId);
  }

  @Get('google')
  @Redirect()
  googleLogin() {
    const url = this.googleOAuthService.getGoogleAuthURL();
    return { url };
  }

  @Get('google/callback')
  async googleCallback(@Query('code') code: string) {
    const { user } = await this.googleOAuthService.getGoogleUser(code);

    if (!user) {
      console.error('No user returned from Google OAuth.');
      return { message: 'User not found' };
    }
    const token = this.authService.createToken(user);
    return { user, token };
  }

  @Post('social-login')
  async socialLogin(@Body() socialLoginDto: SocialLoginDto) {
    return this.authService.socialLogin(socialLoginDto);
  }
  @Post('otp-login')
  async OtpLogin(@Body() otpLoginDto: OtpLoginDto): Promise<any> {
    return this.authService.OtpLogin(otpLoginDto);
  }
}
