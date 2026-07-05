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
import { RefundService } from './refund.service';
import { CreateRefundDto } from './dto/create-refund.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { PermissionGuard } from 'src/guard/permission.guard';
import { RefundStatusType } from './entities/refund.entity';

@Controller('refund')
@UseGuards(JwtAuthGuard)
export class RefundController {
  constructor(private readonly refundService: RefundService) { }

  @Post()
  create(@Body() createRefundDto: CreateRefundDto) {
    return this.refundService.create(createRefundDto);
  }

  @Get('analytics')
  async getRefundAnalytics() {
    return this.refundService.getRefundAnalytics();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.refundService.findOne(id);
  }

  @Get()
  async findAll(
    @Query('refundReason') refundReason: string,
    @Query('status') status?: RefundStatusType,
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    return this.refundService.findAll(refundReason, status, sortOrder);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard)
  remove(@Param('id') id: string) {
    return this.refundService.remove(id);
  }


  @Put(':id')
  async updateRefundStatus(
    @Param('id') id: string,
    @Body('status') status: RefundStatusType,
  ): Promise<void> {
    await this.refundService.updateStatus(id, status);
  }

}