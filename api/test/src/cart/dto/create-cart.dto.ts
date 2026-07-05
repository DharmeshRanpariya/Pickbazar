import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCartDto {
  @IsString()
  @IsNotEmpty()
  readonly productId: string;

  @IsNumber()
  @IsNotEmpty()
  readonly quantity: number;
}
