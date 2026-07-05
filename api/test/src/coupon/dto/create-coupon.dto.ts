import { IsString, IsNotEmpty, IsNumber, IsDate, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Attachment } from 'src/common/entities/attachment.entity';

export class CreateCouponDto {
  @ValidateNested()
  @Type(() => Attachment)
  image: Attachment[];

  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  discountAmount: number;

  @IsNotEmpty()
  minimumCartAmount: number;

  @IsNotEmpty()
  activeForm: Date;

  @IsNotEmpty()
  expireAt: Date;
  
  @IsNotEmpty()
  @IsString()
  startTime: string;

  @IsNotEmpty()
  @IsString()
  endTime: string;
}
