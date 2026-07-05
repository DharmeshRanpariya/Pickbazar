import { IsString, Matches, MinLength } from 'class-validator';
export class ChangePasswordDto {
  @IsString()
  readonly oldPassword: string;
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'Password too weak: must include letters, numbers, and special characters',
  })
  readonly newPassword: string;
}
