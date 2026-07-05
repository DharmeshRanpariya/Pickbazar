import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  Attachment,
  AttachmentSchema,
} from 'src/common/entities/attachment.entity';

@Schema()
class DeliveryTime {
  @Prop()
  title: string;

  @Prop()
  description: string;
}

const DeliveryTimeSchema = SchemaFactory.createForClass(DeliveryTime);

@Schema()
class Social {
  @Prop()
  url: string;

  @Prop()
  icon: string;
}

const SocialSchema = SchemaFactory.createForClass(Social);

@Schema()
class Location {
  @Prop()
  lat: number;

  @Prop()
  lng: number;

  @Prop()
  zip: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  country: string;

  @Prop()
  formattedAddress: string;
}

const LocationSchema = SchemaFactory.createForClass(Location);

@Schema()
class ContactDetails {
  @Prop()
  contact: string;

  @Prop([SocialSchema])
  socials: Social[];

  @Prop()
  website: string;

  @Prop()
  emailAddress: string;

  @Prop({ type: LocationSchema })
  location: Location;
}

const ContactDetailsSchema = SchemaFactory.createForClass(ContactDetails);

@Schema()
class PaymentGateway {
  @Prop()
  name: string;

  @Prop()
  title: string;
}

const PaymentGatewaySchema = SchemaFactory.createForClass(PaymentGateway);

@Schema()
class Seo {
  @Prop({ type: [AttachmentSchema], default: [] })
  ogImage: Attachment;

  @Prop()
  ogTitle: string;

  @Prop()
  metaTags: string;

  @Prop()
  metaTitle: string;

  @Prop()
  canonicalUrl: string;

  @Prop()
  ogDescription: string;

  @Prop()
  twitterHandle: string;

  @Prop()
  metaDescription: string;

  @Prop()
  twitterCardType: string;
}

const SeoSchema = SchemaFactory.createForClass(Seo);

@Schema()
class ReviewSystem {
  @Prop()
  value: string;

  @Prop()
  name: string;
}

const ReviewSystemSchema = SchemaFactory.createForClass(ReviewSystem);

@Schema()
class SmsEvent {
  @Prop()
  statusChangeOrder: boolean;

  @Prop()
  refundOrder: boolean;

  @Prop()
  paymentOrder: boolean;
}

const SmsEventSchema = SchemaFactory.createForClass(SmsEvent);

@Schema()
class EmailEvent {
  @Prop()
  createQuestion: boolean;

  @Prop()
  statusChangeOrder: boolean;

  @Prop()
  refundOrder: boolean;

  @Prop()
  paymentOrder: boolean;

  @Prop()
  createReview: boolean;
}

const EmailEventSchema = SchemaFactory.createForClass(EmailEvent);

@Schema()
class PushNotification {
  @Prop()
  order: boolean;

  @Prop()
  message: boolean;

  @Prop()
  storeNotice: boolean;
}

const PushNotificationSchema = SchemaFactory.createForClass(PushNotification);

@Schema()
class PromoPopup {
  @Prop({ type: [AttachmentSchema], default: [] })
  image: Attachment;

  @Prop()
  title: string;

  @Prop()
  popUpDelay: number;

  @Prop()
  description: string;

  @Prop()
  isPopUpNotShow: boolean;

  @Prop()
  popUpExpiredIn: number;
}

const PromoPopupSchema = SchemaFactory.createForClass(PromoPopup);

@Schema({ timestamps: true })
export class Setting {
  @Prop([DeliveryTimeSchema])
  deliveryTime: DeliveryTime[];

  @Prop()
  isProductReview: boolean;

  @Prop()
  useGoogleMap: boolean;

  @Prop()
  enableTerms: boolean;

  @Prop()
  enableCoupons: boolean;

  @Prop()
  enableReviewPopup: boolean;

  @Prop({ type: ReviewSystemSchema })
  reviewSystem: ReviewSystem;

  @Prop({ type: SeoSchema })
  seo: Seo;

  @Prop({ type: [AttachmentSchema], default: [] })
  logo: Attachment;

  @Prop({ type: [AttachmentSchema], default: [] })
  collapseLogo: Attachment;

  @Prop()
  useOtp: boolean;

  @Prop()
  currency: string;

  @Prop()
  taxClass: string;

  @Prop()
  siteTitle: string;

  @Prop()
  freeShipping: boolean;

  @Prop()
  signupPoints: number;

  @Prop()
  siteSubtitle: string;

  @Prop()
  shippingClass: string;

  @Prop({ type: ContactDetailsSchema })
  contactDetails: ContactDetails;

  @Prop([PaymentGatewaySchema])
  paymentGateway: PaymentGateway[];

  @Prop({
    type: Object,
    default: {
      formation: 'en-US',
      fractions: 2,
    },
  })
  currencyOptions: Record<string, any>;

  @Prop()
  useEnableGateway: boolean;

  @Prop()
  useCashOnDelivery: boolean;

  @Prop()
  freeShippingAmount: number;

  @Prop()
  minimumOrderAmount: number;

  @Prop()
  useMustVerifyEmail: boolean;

  @Prop()
  maximumQuestionLimit: number;

  @Prop()
  currencyToWalletRatio: number;

  @Prop()
  StripeCardOnly: boolean;

  @Prop()
  guestCheckout: boolean;

  @Prop({
    type: Object,
    default: {
      upload_max_filesize: 2048,
      memory_limit: '128M',
      max_execution_time: '30',
      max_input_time: '-1',
      post_max_size: 8192,
    },
  })
  server_info: Record<string, any>;

  @Prop()
  useAi: boolean;

  @Prop()
  defaultAi: string;

  @Prop()
  maxShopDistance: number;

  @Prop()
  siteLink: string;

  @Prop()
  copyrightText: string;

  @Prop()
  externalText: string;

  @Prop()
  externalLink: string;

  @Prop({
    type: Object,
    default: {
      admin: {
        statusChangeOrder: false,
        refundOrder: false,
        paymentOrder: false,
      },
      vendor: {
        statusChangeOrder: false,
        paymentOrder: false,
        refundOrder: false,
      },
      customer: {
        statusChangeOrder: false,
        refundOrder: false,
        paymentOrder: false,
      },
    },
  })
  smsEvent: Record<string, any>;

  @Prop({
    type: Object,
    default: {
      admin: {
        statusChangeOrder: false,
        refundOrder: false,
        paymentOrder: false,
      },
      vendor: {
        createQuestion: false,
        statusChangeOrder: false,
        refundOrder: false,
        paymentOrder: false,
        createReview: false,
      },
      customer: {
        statusChangeOrder: false,
        refundOrder: false,
        paymentOrder: false,
        answerQuestion: false,
      },
    },
  })
  emailEvent: Record<string, any>;

  @Prop({
    type: Object,
    default: {
      order: false,
      message: false,
      storeNotice: false,
    },
  })
  pushNotification: Record<string, any>;

  @Prop()
  isUnderMaintenance: boolean;

  @Prop({
    type: Object,
    default: {
      title: 'Site is under Maintenance',
      description: 'We are currently undergoing essential maintenance...',
      start: '2024-01-31T06:33:30.201258Z',
      until: '2024-02-01T06:33:30.201274Z',
    },
  })
  maintenance: Record<string, any>;

  @Prop()
  isPromoPopUp: boolean;

  @Prop({ type: PromoPopupSchema })
  promoPopup: PromoPopup;
}

export const SettingtSchema = SchemaFactory.createForClass(Setting);
export type SettingDocument = Setting & Document;
