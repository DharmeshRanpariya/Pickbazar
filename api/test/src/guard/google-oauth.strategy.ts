import { BadRequestException, Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class GoogleOAuthService {
  private oauthClient: OAuth2Client;

  constructor(private authService: AuthService) {
    this.oauthClient = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.FRONTEND_URL}/auth/google/callback`,
    );
  }

  getGoogleAuthURL(): string {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ];

    return this.oauthClient.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });
  }

  async getGoogleUser(code: string): Promise<any> {
    try {
      const { tokens } = await this.oauthClient.getToken(code);
      this.oauthClient.setCredentials(tokens);

      const userInfoResponse = await this.oauthClient.request({
        url: 'https://www.googleapis.com/oauth2/v3/userinfo',
      });

      const userInfo = userInfoResponse.data;

      const user = await this.authService.validateGoogleUser(userInfo);
      const token = this.authService.createToken(user);
      return { user, token };
    } catch (error) {
      console.error('Error in getGoogleUser:', error); // Log the error
      throw new BadRequestException('Failed to retrieve user from Google');
    }
  }
}
