import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart, CartSchema } from './entities/cart.entity';
import { UserModule } from 'src/users/users.module';
import { JwtService } from '@nestjs/jwt';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    UserModule, 
    ProductModule,
  ],
  providers: [CartService, JwtService],
  controllers: [CartController],
  exports: [CartService], 
})
export class CartModule {}
