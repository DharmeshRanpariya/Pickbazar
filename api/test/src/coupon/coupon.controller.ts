import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { PermissionGuard } from 'src/guard/permission.guard';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  @UseGuards(PermissionGuard)
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponService.create(createCouponDto);
  }

  @Get()
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('orderBy') orderBy: string,
    @Query('sortedBy') sortedBy: string,
    @Query('code') code?: string,
  ) {
    page = page > 0 ? page : 1;
    limit = limit > 0 ? limit : 10;
    orderBy = orderBy || 'createdAt';
    sortedBy = sortedBy || 'asc';
    return this.couponService.findAll(page, limit, orderBy, sortedBy, code);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.couponService.findOne(id);
  }

  @Put(':id')
  @UseGuards(PermissionGuard)
  update(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
    return this.couponService.update(id, updateCouponDto);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard)
  remove(@Param('id') id: string) {
    return this.couponService.remove(id);
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard)
  async verifyCoupon(
    @Body('code') code: string,
    @Body('sub_total') subTotal: number,
  ) {
    return this.couponService.verifyCoupon(code, subTotal);
  }
}
