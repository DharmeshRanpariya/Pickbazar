import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { UploadsModule } from './uploads/uploads.module';
import { ProductModule } from './product/product.module';
import { CategoriesModule } from './categories/categories.module';
import { TagModule } from './tag/tag.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { ContactModule } from './contact/contact.module';
import { RefundPolicyModule } from './refund-policy/refund-policy.module';
import { CouponModule } from './coupon/coupon.module';
import { FlashSaleModule } from './flash-sale/flash-sale.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { TermsAndConditionsModule } from './terms-and-conditions/terms-and-conditions.module';
import { FaqsModule } from './faqs/faqs.module';
import { RefundReasonModule } from './refund-reason/refund-reason.module';
import { RefundModule } from './refund/refund.module';
import { SettingsModule } from './settings/settings.module';
import { AttributesModule } from './attributes/attributes.module';
import { ReviewModule } from './review/review.module';
import { TypeModule } from './type/type.module';
import { HealthModule } from './health/health.module';
import { BroadcastModule } from './broadcast/broadcast.module';
import { StateAndCityModule } from './state-and-city/state-and-city.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DB_CONNECTION_STRING'),
      }),
    }),
    AuthModule,
    UserModule,
    UploadsModule,
    ProductModule,
    CategoriesModule,
    TagModule,
    CartModule,
    OrderModule,
    ContactModule,
    RefundPolicyModule,
    CouponModule,
    FlashSaleModule,
    WishlistsModule,
    FaqsModule,
    TermsAndConditionsModule,
    RefundReasonModule,
    RefundModule,
    SettingsModule,
    AttributesModule,
    ReviewModule,
    TypeModule,
    HealthModule,
    BroadcastModule,
    StateAndCityModule,
  ],
})
export class AppModule {}
