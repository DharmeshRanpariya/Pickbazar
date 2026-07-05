import { Module } from '@nestjs/common';
import { RefundService } from './refund.service';
import { RefundController } from './refund.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Refund, RefundSchema } from './entities/refund.entity';
import { UserModule } from 'src/users/users.module';
import { JwtService } from '@nestjs/jwt';
import { OrderModule } from 'src/order/order.module';
import { Product, ProductSchema, Variation, VariationSchema } from 'src/product/entities/product.entity';
import { Order, OrderSchema } from 'src/order/entities/order.entity';
import { Coupon,CouponSchema } from 'src/coupon/entities/coupon.entity';
import { FlashSaleModule } from 'src/flash-sale/flash-sale.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Variation.name, schema: VariationSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Refund.name, schema: RefundSchema },
      { name: Coupon.name, schema: CouponSchema },
    ]),
    UserModule,
    OrderModule,
    FlashSaleModule,
  ],
  controllers: [RefundController],
  providers: [RefundService, JwtService],
})
export class RefundModule {}