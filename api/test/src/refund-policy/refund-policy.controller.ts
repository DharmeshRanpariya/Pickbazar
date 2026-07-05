import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';
import { RefundPolicyService } from './refund-policy.service';
import { CreateRefundPolicyDto } from './dto/create-refund-policy.dto';
import { UpdateRefundPolicyDto } from './dto/update-refund-policy.dto';
import { PermissionGuard } from 'src/guard/permission.guard';

@Controller('refund-policy')
export class RefundPolicyController {
  constructor(private readonly refundPolicyService: RefundPolicyService) {}

  @UseGuards(PermissionGuard)
  @Post()
  create(@Body() createRefundPolicyDto: CreateRefundPolicyDto) {
    return this.refundPolicyService.create(createRefundPolicyDto);
  }

  @Get()
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('title') title: string,
    @Query('target') target: string,
    @Query('status') status: string,
    @Query('orderBy') orderBy: string,
    @Query('sortedBy') sortedBy: string,
  ) {
    return this.refundPolicyService.findAll({
      page,
      limit,
      title,
      target,
      status,
      orderBy,
      sortedBy,
    });
  }

  @UseGuards(PermissionGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.refundPolicyService.findOne(id);
  }

  @UseGuards(PermissionGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateRefundPolicyDto: UpdateRefundPolicyDto,
  ) {
    return this.refundPolicyService.update(id, updateRefundPolicyDto);
  }

  @UseGuards(PermissionGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.refundPolicyService.remove(id);
  }
}
