import * as yup from 'yup';
import { CouponType } from '@/types';

export const couponValidationSchema = yup.object().shape({
  code: yup
    .string()
    .required('form:error-coupon-code-required')
    .matches(
      /^[a-zA-Z0-9@_-]+$/,
      'form:error-coupon-code-cannot-contain-white-space',
    ),
  type: yup
    .string()
    .oneOf([CouponType.FIXED, CouponType.PERCENTAGE, CouponType.FREE_SHIPPING])
    .required('form:error-type-required'),
  discountAmount: yup
    .number()
    .moreThan(-1, 'form:error-coupon-amount-must-positive')
    .typeError('form:error-amount-number'),
  minimumCartAmount: yup.number().when('type', {
    is: (data: string) => data === CouponType.FIXED,
    then: () =>
      yup
        .number()
        .moreThan(
          yup.ref('discountAmount'),
          'form:error-minimum-card-and-discount-amount',
        )
        .typeError('form:error-minimum-coupon-amount-number'),
    otherwise: () =>
      yup.number().typeError('form:error-minimum-coupon-amount-number'),
  }),
  activeForm: yup.date().required('form:error-active-date-required'),
  expireAt: yup
    .date()
    .required('form:error-expire-date-required')
    .min(yup.ref('activeForm'), 'form:error-expire-and-active-date'),
});
