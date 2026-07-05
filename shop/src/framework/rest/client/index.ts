import type {
  Attachment,
  Author,
  AuthorPaginator,
  AuthorQueryOptions,
  AuthResponse,
  CategoryPaginator,
  CategoryQueryOptions,
  ChangePasswordUserInput,
  CheckoutVerificationInput,
  CouponPaginator,
  CouponQueryOptions,
  CreateAbuseReportInput,
  CreateContactUsInput,
  CreateFeedbackInput,
  CreateOrderInput,
  CreateQuestionInput,
  CreateRefundInput,
  CreateReviewInput,
  DownloadableFilePaginator,
  Feedback,
  ForgotPasswordUserInput,
  LoginUserInput,
  Manufacturer,
  ManufacturerPaginator,
  ManufacturerQueryOptions,
  MyQuestionQueryOptions,
  MyReportsQueryOptions,
  Order,
  OrderPaginator,
  OrderQueryOptions,
  OrderStatusPaginator,
  OtpLoginInputType,
  OTPResponse,
  PasswordChangeResponse,
  PopularProductQueryOptions,
  Product,
  ProductPaginator,
  ProductQueryOptions,
  QueryOptions,
  QuestionPaginator,
  QuestionQueryOptions,
  Refund,
  RefundPaginator,
  RegisterUserInput,
  ResetPasswordUserInput,
  Review,
  ReviewPaginator,
  ReviewQueryOptions,
  ReviewResponse,
  SendOtpCodeInputType,
  Settings,
  Shop,
  ShopPaginator,
  ShopQueryOptions,
  SocialLoginInputType,
  TagPaginator,
  TagQueryOptions,
  Type,
  TypeQueryOptions,
  UpdateReviewInput,
  UpdateUserInput,
  User,
  VerifiedCheckoutData,
  VerifyCouponInputType,
  VerifyCouponResponse,
  VerifyForgotPasswordUserInput,
  VerifyOtpInputType,
  Wishlist,
  WishlistPaginator,
  WishlistQueryOptions,
  GetParams,
  SettingsQueryOptions,
  CreateOrderPaymentInput,
  SetupIntentInfo,
  PaymentIntentCollection,
  Card,
  BestSellingProductQueryOptions,
  UpdateEmailUserInput,
  EmailChangeResponse,
  VerificationEmailUserInput,
  StoreNoticeQueryOptions,
  StoreNoticePaginator,
  StoreNotice,
  FAQS,
  FaqsQueryOptions,
  FaqsPaginator,
  ShopMapLocation,
  RefundQueryOptions,
  RefundReasonPaginator,
  TermsAndConditionsQueryOptions,
  TermsAndConditionsPaginator,
  FlashSaleQueryOptions,
  FlashSalePaginator,
  FlashSale,
  RefundPolicyPaginator,
  RefundPolicyQueryOptions,
  SingleFlashSale,
  FlashSaleProductsQueryOptions,
  VerificationTokenUserInput,
  Address,
  Cart,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';
//@ts-ignore
import { OTPVerifyResponse } from '@/types';
import { HttpClient2 } from './http-client2';

class Client {
  products = {
    all: ({
      type,
      categories,
      name,
      shop_id,
      author,
      manufacturer,
      min_price,
      max_price,
      tags,
      ...params
    }: Partial<ProductQueryOptions>) =>
      HttpClient2.get<ProductPaginator>(API_ENDPOINTS.PRODUCTS, {
        searchJoin: 'and',
        with: 'type;author',
        ...params,
        name,
        categories,
        search: HttpClient2.formatSearchParams({
          type,
          shop_id,
          author,
          manufacturer,
          min_price,
          max_price,
          tags,
          status: 'publish',
        }),
      }),
    // popular: (params: Partial<PopularProductQueryOptions>) =>
    //   HttpClient.get<Product[]>(API_ENDPOINTS.PRODUCTS_POPULAR, params),

    // bestSelling: (params: Partial<BestSellingProductQueryOptions>) =>
    //   HttpClient.get<Product[]>(API_ENDPOINTS.BEST_SELLING_PRODUCTS, params),

    // questions: ({ question, ...params }: QuestionQueryOptions) =>
    //   HttpClient.get<QuestionPaginator>(API_ENDPOINTS.PRODUCTS_QUESTIONS, {
    //     searchJoin: 'and',
    //     ...params,
    //     search: HttpClient.formatSearchParams({
    //       question,
    //     }),
    //   }),

    // get: ({ slug, language }: GetParams) =>
    //   HttpClient.get<Product>(`${API_ENDPOINTS.PRODUCTS}/${slug}`, {
    //     language,
    //     searchJoin: 'and',
    //     with: 'categories;shop;type;variations;variations.attribute.values;variation_options;tags',
    //   }),

    // createFeedback: (input: CreateFeedbackInput) =>
    //   HttpClient.post<Feedback>(API_ENDPOINTS.FEEDBACK, input),
    // createAbuseReport: (input: CreateAbuseReportInput) =>
    //   HttpClient.post<Review>(
    //     API_ENDPOINTS.PRODUCTS_REVIEWS_ABUSE_REPORT,
    //     input,
    //   ),
    // createQuestion: (input: CreateQuestionInput) =>
    //   HttpClient.post<Review>(API_ENDPOINTS.PRODUCTS_QUESTIONS, input),
    // getProductsByFlashSale: ({ slug, language }: GetParams) => {
    //   return HttpClient.get<Product>(
    //     `${API_ENDPOINTS.PRODUCTS_BY_FLASH_SALE}`,
    //     {
    //       language,
    //       slug,
    //     },
    //   );
    // },
  };
  addToCart = {
    findAll: () => HttpClient2.get<Cart>(API_ENDPOINTS.ADD_TO_CART),
  };
  // myQuestions = {
  //   all: (params: MyQuestionQueryOptions) =>
  //     HttpClient.get<QuestionPaginator>(API_ENDPOINTS.MY_QUESTIONS, {
  //       with: 'user',
  //       orderBy: 'created_at',
  //       sortedBy: 'desc',
  //       ...params,
  //     }),
  // };
  // myReports = {
  //   all: (params: MyReportsQueryOptions) =>
  //     HttpClient.get<QuestionPaginator>(API_ENDPOINTS.MY_REPORTS, {
  //       with: 'user',
  //       orderBy: 'created_at',
  //       sortedBy: 'desc',
  //       ...params,
  //     }),
  // };
  reviews = {
    // all: ({ rating, ...params }: ReviewQueryOptions) =>
    //   HttpClient.get<ReviewPaginator>(API_ENDPOINTS.PRODUCTS_REVIEWS, {
    //     searchJoin: 'and',
    //     with: 'user',
    //     ...params,
    //     search: HttpClient.formatSearchParams({
    //       rating,
    //     }),
    //   }),
    get: ({ id }: { id: string }) =>
      HttpClient2.get<Review>(
        `${API_ENDPOINTS.PRODUCTS_REVIEWS}/product/${id}`,
      ),

    create: (input: CreateReviewInput) =>
      HttpClient2.post<ReviewResponse>(API_ENDPOINTS.PRODUCTS_REVIEWS, input),
    update: (input: UpdateReviewInput) =>
      HttpClient2.put<ReviewResponse>(
        `${API_ENDPOINTS.PRODUCTS_REVIEWS}/${input.id}`,
        input,
      ),
  };
  categories = {
    all: ({
      type,
      page = 1,
      limit = 999,
      ...params
    }: Partial<CategoryQueryOptions>) =>
      HttpClient2.get<CategoryPaginator>(API_ENDPOINTS.CATEGORIES, {
        searchJoin: 'and',
        page: Number(page),
        limit: Number(limit),
        ...params,
        ...(type && { search: HttpClient2.formatSearchParams({ type }) }),
      }),
  };
  // tags = {
  //   all: ({ type, ...params }: Partial<TagQueryOptions>) =>
  //     HttpClient.get<TagPaginator>(API_ENDPOINTS.TAGS, {
  //       searchJoin: 'and',
  //       ...params,
  //       ...(type && { search: HttpClient.formatSearchParams({ type }) }),
  //     }),
  // };
  types = {
    all: async (params?: Partial<TypeQueryOptions>) => {
      const data = await HttpClient2.get<Type[]>(API_ENDPOINTS.TYPES, params);
      return data;
    },
    get: async ({ slug, language }: { slug: string; language: string }) => {
      const data = HttpClient2.get<Type>(`${API_ENDPOINTS.TYPES}/${slug}`, {
        language,
      });
      return data;
    },
  };
  // shops = {
  //   all: (params: Partial<ShopQueryOptions>) =>
  //     HttpClient.get<ShopPaginator>(API_ENDPOINTS.SHOPS, {
  //       search: HttpClient.formatSearchParams({
  //         is_active: '1',
  //       }),
  //       ...params,
  //     }),
  //   get: (slug: string) =>
  //     HttpClient.get<Shop>(`${API_ENDPOINTS.SHOPS}/${slug}`),

  //   searchNearShops: (input: ShopMapLocation) =>
  //     HttpClient.get<any>(API_ENDPOINTS.NEAR_SHOPS, input),

  //   getSearchNearShops: ({ lat, lng }: ShopMapLocation) =>
  //     HttpClient.get<any>(`${API_ENDPOINTS.NEAR_SHOPS}/${lat}/${lng}`),
  // };
  // storeNotice = {
  //   all: ({ shop_id, shops, ...params }: Partial<StoreNoticeQueryOptions>) => {
  //     return HttpClient.get<StoreNoticePaginator>(API_ENDPOINTS.STORE_NOTICES, {
  //       searchJoin: 'and',
  //       shop_id: shop_id,
  //       ...params,
  //       search: HttpClient.formatSearchParams({ shop_id, shops }),
  //     });
  //   },
  // };
  // authors = {
  //   all: ({ name, ...params }: Partial<AuthorQueryOptions>) => {
  //     return HttpClient.get<AuthorPaginator>(API_ENDPOINTS.AUTHORS, {
  //       ...params,
  //       searchJoin: 'and',
  //       search: HttpClient.formatSearchParams({
  //         name,
  //       }),
  //     });
  //   },
  //   top: ({ type, ...params }: Partial<AuthorQueryOptions>) =>
  //     HttpClient.get<Author[]>(API_ENDPOINTS.AUTHORS_TOP, {
  //       ...params,
  //       search: HttpClient.formatSearchParams({
  //         type,
  //       }),
  //     }),
  //   get: ({ slug, language }: { slug: string; language?: string }) =>
  //     HttpClient.get<Author>(`${API_ENDPOINTS.AUTHORS}/${slug}`, {
  //       language,
  //     }),
  // };
  // manufacturers = {
  //   all: ({ name, type, ...params }: Partial<ManufacturerQueryOptions>) =>
  //     HttpClient.get<ManufacturerPaginator>(API_ENDPOINTS.MANUFACTURERS, {
  //       ...params,
  //       search: HttpClient.formatSearchParams({
  //         name,
  //         type,
  //       }),
  //     }),
  //   top: ({ type, ...params }: Partial<ManufacturerQueryOptions>) =>
  //     HttpClient.get<Manufacturer[]>(API_ENDPOINTS.MANUFACTURERS_TOP, {
  //       ...params,
  //       search: HttpClient.formatSearchParams({
  //         type,
  //       }),
  //     }),
  //   get: ({ slug, language }: { slug: string; language?: string }) =>
  //     HttpClient.get<Manufacturer>(`${API_ENDPOINTS.MANUFACTURERS}/${slug}`, {
  //       language,
  //     }),
  // };
  coupons = {
    all: (params: Partial<CouponQueryOptions>) =>
      HttpClient2.get<CouponPaginator>(API_ENDPOINTS.COUPONS, params),
    verify: (input: VerifyCouponInputType) =>
      HttpClient2.post<VerifyCouponResponse>(
        API_ENDPOINTS.COUPONS_VERIFY,
        input,
      ),
  };
  orders = {
    all: (params: Partial<OrderQueryOptions>) =>
      HttpClient2.get<OrderPaginator>(API_ENDPOINTS.ORDERS_MY_ORDERS, {
        with: 'refund',
        ...params,
      }),
    get: (trackingNumber: string) =>
      HttpClient2.get<Order>(
        `${API_ENDPOINTS.ORDERS}/tracking/${trackingNumber}`,
        {
          with: 'refund;reviews',
        },
      ),
    create: (input: CreateOrderInput) =>
      HttpClient2.post<Order>(API_ENDPOINTS.ORDERS, input),

    refunds: (params: Pick<QueryOptions, 'limit'>) =>
      HttpClient2.get<RefundPaginator>(API_ENDPOINTS.ORDERS_REFUNDS, {
        with: 'refund_policy;order',
        ...params,
      }),
    createRefund: (input: CreateRefundInput) =>
      HttpClient2.post<Refund>(API_ENDPOINTS.ORDERS_REFUNDS, input),
    payment: (input: CreateOrderPaymentInput) =>
      HttpClient.post<any>(API_ENDPOINTS.ORDERS_PAYMENT, input),
    savePaymentMethod: (input: any) =>
      HttpClient.post<any>(API_ENDPOINTS.SAVE_PAYMENT_METHOD, input),

    downloadable: (query?: OrderQueryOptions) =>
      HttpClient.get<DownloadableFilePaginator>(
        API_ENDPOINTS.ORDERS_DOWNLOADS,
        query,
      ),
    verify: (input: CheckoutVerificationInput) =>
      HttpClient2.post<VerifiedCheckoutData>(
        API_ENDPOINTS.ORDERS_CHECKOUT_VERIFY,
        input,
      ),
    generateDownloadLink: (input: { digital_file_id: string }) =>
      HttpClient.post<string>(
        API_ENDPOINTS.GENERATE_DOWNLOADABLE_PRODUCT_LINK,
        input,
      ),
    getPaymentIntentOriginal: ({
      tracking_number,
    }: {
      tracking_number: string;
    }) =>
      HttpClient.get<PaymentIntentCollection>(API_ENDPOINTS.PAYMENT_INTENT, {
        tracking_number,
      }),
    getPaymentIntent: ({
      tracking_number,
      payment_gateway,
      recall_gateway,
    }: {
      tracking_number: string;
      payment_gateway?: string;
      recall_gateway?: boolean;
    }) =>
      HttpClient.get<PaymentIntentCollection>(API_ENDPOINTS.PAYMENT_INTENT, {
        tracking_number,
        payment_gateway,
        recall_gateway,
      }),
    cancel: (
      orderId: string,
      input: { cancelReason: string; cancelDescription: string },
    ) => HttpClient2.put(`${API_ENDPOINTS.ORDERS}/${orderId}/cancel`, input),
  };
  refundReason = {
    all: ({ type, ...params }: Partial<RefundQueryOptions>) =>
      HttpClient2.get<RefundReasonPaginator>(API_ENDPOINTS.REFUNDS_REASONS, {
        searchJoin: 'and',
        ...params,
        ...(type && { search: HttpClient.formatSearchParams({ type }) }),
      }),
  };
  users = {
    me: () => HttpClient2.get<User>(API_ENDPOINTS.USERS_ME),
    update: (user: UpdateUserInput) =>
      HttpClient2.put<User>(API_ENDPOINTS.USERS, user),
    add: (address: Address) =>
      HttpClient2.post<User>(API_ENDPOINTS.USERS_ADDRESS_ADD, address),
    updateAddress: ({ addressId, ...formattedInput }) =>
      HttpClient2.put<User>(
        `${API_ENDPOINTS.USERS_ADDRESS_UPDATE}/${addressId}`,
        formattedInput,
      ),
    login: (input: LoginUserInput) =>
      HttpClient2.post<AuthResponse>(API_ENDPOINTS.USERS_LOGIN, input),
    socialLogin: (input: SocialLoginInputType) =>
      HttpClient2.post<AuthResponse>(API_ENDPOINTS.SOCIAL_LOGIN, input),
    sendOtpCode: (input: SendOtpCodeInputType) =>
      HttpClient2.post<OTPResponse>(API_ENDPOINTS.SEND_OTP_CODE, input),
    verifyOtpCode: (input: VerifyOtpInputType) =>
      HttpClient2.post<OTPVerifyResponse>(API_ENDPOINTS.VERIFY_OTP_CODE, input),
    OtpLogin: (input: OtpLoginInputType) =>
      HttpClient2.post<AuthResponse>(API_ENDPOINTS.OTP_LOGIN, input),
    register: (input: RegisterUserInput) =>
      HttpClient2.post<AuthResponse>(API_ENDPOINTS.USERS_REGISTER, input),
    forgotPassword: (input: ForgotPasswordUserInput) =>
      HttpClient2.post<PasswordChangeResponse>(
        API_ENDPOINTS.USERS_FORGOT_PASSWORD,
        input,
      ),
    verifyForgotPasswordToken: (input: VerifyForgotPasswordUserInput) =>
      HttpClient2.post<PasswordChangeResponse>(
        API_ENDPOINTS.USERS_VERIFY_FORGOT_PASSWORD_TOKEN,
        input,
      ),
    resetPassword: (input: ResetPasswordUserInput) =>
      HttpClient2.post<PasswordChangeResponse>(
        API_ENDPOINTS.USERS_RESET_PASSWORD,
        input,
      ),
    changePassword: (input: ChangePasswordUserInput) =>
      HttpClient2.post<PasswordChangeResponse>(
        API_ENDPOINTS.USERS_CHANGE_PASSWORD,
        input,
      ),
    // updateEmail: (input: UpdateEmailUserInput) =>
    //   HttpClient.post<EmailChangeResponse>(
    //     API_ENDPOINTS.USERS_UPDATE_EMAIL,
    //     input,
    //   ),
    logout: () => true,
    //  HttpClient.post<boolean>(API_ENDPOINTS.USERS_LOGOUT, {}),
    deleteAddress: ({ id }: { id: string }) =>
      HttpClient2.delete<boolean>(`${API_ENDPOINTS.USERS_ADDRESS}/${id}`),
    subscribe: (input: { email: string }) =>
      HttpClient2.post<any>(API_ENDPOINTS.USERS_SUBSCRIBE_TO_NEWSLETTER, input),
    contactUs: (input: CreateContactUsInput) =>
      HttpClient2.post<any>(API_ENDPOINTS.USERS_CONTACT_US, input),
    resendVerificationEmail: (email) => {
      return HttpClient2.post<VerificationEmailUserInput>(
        API_ENDPOINTS.RESEND_VERIFY_EMAIL,
        { email },
      );
    },
    emailVerify: (token) => {
      return HttpClient2.post<VerificationTokenUserInput>(
        API_ENDPOINTS.SEND_VERIFICATION_EMAIL,
        { token },
      );
    },
  };
  wishlist = {
    all: (params: WishlistQueryOptions) =>
      HttpClient2.get<WishlistPaginator>(API_ENDPOINTS.USERS_WISHLIST, {
        with: 'shop',
        orderBy: 'created_at',
        sortedBy: 'desc',
        ...params,
      }),
    toggle: (input: { productId: string; language?: string }) =>
      HttpClient2.post<{ in_wishlist: boolean }>(
        API_ENDPOINTS.USERS_WISHLIST_TOGGLE,
        input,
      ),
    remove: (id: string) =>
      HttpClient2.delete<Wishlist>(`${API_ENDPOINTS.WISHLIST}/${id}`),
    checkIsInWishlist: ({ product_id }: { product_id: string }) =>
      HttpClient2.get<boolean>(`${API_ENDPOINTS.WISHLIST}/${product_id}`),
  };
  settings = {
    all: (params?: SettingsQueryOptions) =>
      HttpClient2.get<Settings>(API_ENDPOINTS.SETTINGS, { ...params }),
    upload: (input: File[]) => {
      let formData = new FormData();
      input.forEach((attachment) => {
        formData.append('file', attachment);
      });
      return HttpClient2.post<Attachment[]>(API_ENDPOINTS.UPLOADS, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
  };
  // cards = {
  //   all: (params?: any) =>
  //     HttpClient.get<Card[]>(API_ENDPOINTS.CARDS, { ...params }),
  //   remove: ({ id }: { id: string }) =>
  //     HttpClient.delete<any>(`${API_ENDPOINTS.CARDS}/${id}`),
  //   addPaymentMethod: (method_key: any) =>
  //     HttpClient.post<any>(API_ENDPOINTS.CARDS, method_key),
  //   makeDefaultPaymentMethod: (input: any) =>
  //     HttpClient.post<any>(API_ENDPOINTS.SET_DEFAULT_CARD, input),
  // };

  faqs = {
    // all: (params?: any) =>
    //   HttpClient.get<FAQS[]>(API_ENDPOINTS.FAQS, { ...params }),
    all: ({ faq_type, issued_by, ...params }: Partial<FaqsQueryOptions>) =>
      HttpClient2.get<FaqsPaginator>(API_ENDPOINTS.FAQS, {
        ...params,
        search: HttpClient.formatSearchParams({
          faq_type,
          issued_by,
        }),
      }),
    get: (id: string) => HttpClient.get<FAQS>(`${API_ENDPOINTS.FAQS}/${id}`),
  };

  termsAndConditions = {
    // all: (params?: any) =>
    //   HttpClient.get<FAQS[]>(API_ENDPOINTS.FAQS, { ...params }),
    all: ({
      type,
      issued_by,
      ...params
    }: Partial<TermsAndConditionsQueryOptions>) =>
      HttpClient2.get<TermsAndConditionsPaginator>(
        API_ENDPOINTS.TERMS_AND_CONDITIONS,
        {
          searchJoin: 'and',
          ...params,
          search: HttpClient.formatSearchParams({
            type,
            issued_by,
          }),
        },
      ),
    get: (id: string) =>
      HttpClient2.get<FAQS>(`${API_ENDPOINTS.TERMS_AND_CONDITIONS}/${id}`),
  };
  flashSale = {
    // all: (params?: any) =>
    //   HttpClient.get<FAQS[]>(API_ENDPOINTS.FAQS, { ...params }),
    all: ({ ...params }: Partial<FlashSaleQueryOptions>) =>
      HttpClient2.get<FlashSalePaginator>(API_ENDPOINTS.FLASH_SALE, {
        ...params,
      }),
    // get: ({ slug, language }: { slug: string; language?: string }) => {
    //   return HttpClient.get<FlashSale>(`${API_ENDPOINTS.FLASH_SALE}/${slug}`, {
    //     language,
    //     with: 'products',
    //   });
    // },
    // getProductsByFlashSale: ({
    //   slug,
    //   ...params
    // }: FlashSaleProductsQueryOptions) => {
    //   return HttpClient.get<ProductPaginator>(
    //     API_ENDPOINTS.PRODUCTS_BY_FLASH_SALE,
    //     {
    //       searchJoin: 'and',
    //       slug,
    //       ...params,
    //     },
    //   );
    // },
  };

  refundPolicies = {
    all: ({
      title,
      status,
      target,
      ...params
    }: Partial<RefundPolicyQueryOptions>) =>
      HttpClient2.get<RefundPolicyPaginator>(API_ENDPOINTS.REFUND_POLICIES, {
        searchJoin: 'and',
        ...params,
        title,
        target,
        status,
      }),
  };
}

const client = new Client();

export default client;
