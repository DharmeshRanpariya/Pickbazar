import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'enter email ?' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
