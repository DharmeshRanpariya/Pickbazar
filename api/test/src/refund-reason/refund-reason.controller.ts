import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { RefundReasonService } from './refund-reason.service';
import { CreateRefundReasonDto } from './dto/create-refund-reason.dto';
import { UpdateRefundReasonDto } from './dto/update-refund-reason.dto';
import { PermissionGuard } from 'src/guard/permission.guard';

@Controller('refund-reasons')
export class RefundReasonController {
  constructor(private readonly refundReasonService: RefundReasonService) {}

  @Post()
  @UseGuards(PermissionGuard)
  create(@Body() createRefundReasonDto: CreateRefundReasonDto) {
    return this.refundReasonService.create(createRefundReasonDto);
  }

  @Get()
  findAll(@Query('name') name: string) {
    return this.refundReasonService.findAll(name);
  }
 
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.refundReasonService.findOne(id);
  }

  @Put(':id')
  @UseGuards(PermissionGuard)
  update(
    @Param('id') id: string,
    @Body() updateRefundReasonDto: UpdateRefundReasonDto,
  ) {
    return this.refundReasonService.update(id, updateRefundReasonDto);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard)
  remove(@Param('id') id: string) {
    return this.refundReasonService.remove(id);
  }
}
