import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from './order.controller';
import { Order, OrderSchema } from './entities/order.entity';
import { CartModule } from '../cart/cart.module';
import { OrderService } from './order.service';
import { JwtService } from '@nestjs/jwt';
import { ProductModule } from 'src/product/product.module';
import { UsersService } from 'src/users/users.service';
import { UserModule } from 'src/users/users.module';
import { FlashSaleModule } from 'src/flash-sale/flash-sale.module';
import { BroadcastModule } from 'src/broadcast/broadcast.module';
import { Broadcast, BroadcastSchema } from 'src/broadcast/entities/broadcast.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: Broadcast.name, schema: BroadcastSchema }]),
    CartModule,
    ProductModule,
    UserModule,
    FlashSaleModule,
    BroadcastModule,
  ],
  providers: [OrderService, JwtService, UsersService],
  controllers: [OrderController],
  exports: [OrderService, MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])],
})
export class OrderModule {}
