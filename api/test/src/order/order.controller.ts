import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  Put,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { PermissionGuard } from 'src/guard/permission.guard';
import { CheckoutVerificationDto } from './dto/verify-checkout.dto';

@Controller('order')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Req() request: any, @Body() createOrderDto: any) {
    const userId = request.user.sub;
    return this.orderService.create(userId, createOrderDto);
  }

  @UseGuards(PermissionGuard)
  @Get()
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('orderBy') orderBy: string,
    @Query('sortedBy') sortedBy: string,
    @Query('trackingNumber') trackingNumber: string,
    @Query('orderStatus') orderStatus: string,
    @Query('paymentGateway') paymentGateway: string,
  ) {
    return this.orderService.findAll({
      page,
      limit,
      orderBy,
      sortedBy,
      trackingNumber,
      orderStatus,
      paymentGateway,
    });
  }

  @Get('/analytics')
  async getTotalRevenueAndOrderCount() {
    return this.orderService.getTotalRevenueAndOrderCount();
  }

  @Get('/my-orders')
  findMyOrders(
    @Req() request: any,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('orderBy') orderBy: string,
    @Query('sortedBy') sortedBy: string,
  ) {
    const userId = request.user.sub;
    return this.orderService.findByUserId(userId, {
      page,
      limit,
      orderBy,
      sortedBy,
    });
  }

  @Put(':id/cancel')
  cancelOrder(@Param('id') id: string, @Req() request: any) {
    const userId = request.user.sub;
    return this.orderService.cancelOrder(
      id,
      userId,
      request.body.cancelReason,
      request.body.cancelDescription,
    );
  }

  @Get('/tracking/:trackingNumber')
  findByTrackingNumber(@Param('trackingNumber') trackingNumber: string) {
    return this.orderService.findByTrackingNumber(trackingNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @UseGuards(PermissionGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: any) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }

  @UseGuards(PermissionGuard)
  @Post('/bill')
  async generateBill(@Body('orderId') orderId: string) {
    return this.orderService.generateOrderPdf(orderId);
  }

  @Post('checkout')
  async checkout(@Body('amount') amount: number) {
    return this.orderService.checkout(amount);
  }

  @Post('checkout/verify')
  async checkoutVerify(@Query() query: CheckoutVerificationDto) {
    return this.orderService.verifyCheckout(query);
  }

  @Post('paymentverification')
  async verifyPayment(@Body() verifyPaymentDto: any) {
    return this.orderService.verifyPayment(verifyPaymentDto);
  }
}
