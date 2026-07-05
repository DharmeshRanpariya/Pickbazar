import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignupDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsEmail({},{message:"enter email ?"})
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly password: string;
}
