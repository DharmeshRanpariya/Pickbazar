import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FlashSaleService } from './flash-sale.service';
import { FlashSaleController } from './flash-sale.controller';
import { FlashSale, FlashSaleSchema } from './entities/flash-sale.entity';
import { UserModule } from 'src/users/users.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FlashSale.name, schema: FlashSaleSchema },
    ]),
    UserModule,
  ],

  controllers: [FlashSaleController],
  providers: [FlashSaleService, JwtService],
  exports: [FlashSaleService],
})
export class FlashSaleModule {}
