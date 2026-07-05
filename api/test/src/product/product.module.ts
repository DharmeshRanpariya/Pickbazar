import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductService } from './product.service';
import { Product, ProductSchema } from './entities/product.entity';
import { ProductController } from './product.controller';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/users/users.module';
import { FlashSaleModule } from 'src/flash-sale/flash-sale.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    UserModule,
    FlashSaleModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, JwtService],
  exports: [
    ProductService,
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
})
export class ProductModule {}
