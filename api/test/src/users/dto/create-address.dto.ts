import { IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  title: string;

  @IsString()
  type: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  zip: string;

  @IsString()
  street_address: string;
}
