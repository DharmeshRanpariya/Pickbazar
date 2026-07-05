import { Type } from "class-transformer";
import { IsArray, IsMongoId, IsNumber, IsOptional, IsString, ValidateNested, IsEnum, IsNotEmpty } from "class-validator";
import { Attachment } from "src/common/entities/attachment.entity";
import { RefundStatusType } from "../entities/refund.entity";

export class CreateRefundDto {
  @IsString()
  refundReason: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Attachment)
  image?: Attachment[];

  @IsMongoId()
  orderId: string;

  @IsMongoId()
  productId: string;

  @IsOptional()
  couponType: string | null;

  @IsOptional()
   flashSaleType: string | null;
  
  @IsOptional()
  @IsMongoId({ each: true })
  variationOptionsId?: string ;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsEnum(RefundStatusType)
  status?: RefundStatusType;
}