import { PartialType } from '@nestjs/swagger';
import { CreateRefundReasonDto } from './create-refund-reason.dto';

export class UpdateRefundReasonDto extends PartialType(CreateRefundReasonDto) {}
