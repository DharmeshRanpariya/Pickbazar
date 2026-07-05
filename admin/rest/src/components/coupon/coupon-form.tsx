import Input from '@/components/ui/input';
import { Controller, useForm } from 'react-hook-form';
import DatePicker from '@/components/ui/date-picker';
import Button from '@/components/ui/button';
import TextArea from '@/components/ui/text-area';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import Label from '@/components/ui/label';
import Radio from '@/components/ui/radio/radio';
import { useRouter } from 'next/router';
import ValidationError from '@/components/ui/form-validation-error';
import { useSettings } from '@/contexts/settings.context';
import { useTranslation } from 'next-i18next';
import FileInput from '@/components/ui/file-input';
import { yupResolver } from '@hookform/resolvers/yup';
import { couponValidationSchema } from './coupon-validation-schema';
import { AttachmentInput, Coupon, CouponType, ItemProps } from '@/types';
import {
  useCreateCouponMutation,
  useUpdateCouponMutation,
} from '@/data/coupon';
import { getErrorMessage } from '@/utils/form-error';
import { Config } from '@/config';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { useSettingsQuery } from '@/data/settings';
import { useCallback, useMemo } from 'react';
import OpenAIButton from '@/components/openAI/openAI.button';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import { CouponDescriptionSuggestion } from '@/components/coupon/coupon-ai-prompt';
import { useShopQuery } from '@/data/shop';
import SwitchInput from '../ui/switch-input';
import TimePickerInput from '../ui/time-picker';

type FormValues = {
  id: any;
  code: string;
  type: CouponType;
  description: string;
  discountAmount: number;
  minimumCartAmount: number;
  image: AttachmentInput;
  activeForm: string;
  expireAt: string;
  startTime: string;
  endTime: string;
  target: boolean;
};

const defaultValues = {
  image: '',
  type: CouponType.FIXED,
  discountAmount: 0,
  target: 0,
  minimumCartAmount: 0,
  activeForm: new Date(),
};

type IProps = {
  initialValues?: Coupon;
};
export default function CreateOrUpdateCouponForm({ initialValues }: IProps) {
  const router = useRouter();
  const { locale } = useRouter();
  const { t } = useTranslation();

  const { data: shopData } = useShopQuery(
    { slug: router.query.shop as string },
    {
      enabled: !!router.query.shop,
    },
  );
  const shopId = shopData?.id!;
  const formatTime = (date: Date) => {
    if (!date) return '';
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    // @ts-ignore
    defaultValues: initialValues
      ? {
          ...initialValues,
          activeForm: new Date(initialValues.activeForm!),
          expireAt: new Date(initialValues.expireAt!),
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(couponValidationSchema),
  });
  const { currency } = useSettings();
  const { mutate: createCoupon, isLoading: creating } =
    useCreateCouponMutation();
  const { mutate: updateCoupon, isLoading: updating } =
    useUpdateCouponMutation();

  const { openModal } = useModalAction();
  const {
    // @ts-ignore
    settings: { options },
  } = useSettingsQuery({
    language: locale!,
  });

  const generateName = watch('code');
  const couponDescriptionSuggestionLists = useMemo(() => {
    return CouponDescriptionSuggestion({ name: generateName ?? '' });
  }, [generateName]);

  const handleGenerateDescription = useCallback(() => {
    openModal('GENERATE_DESCRIPTION', {
      control,
      name: generateName,
      set_value: setValue,
      key: 'description',
      suggestion: couponDescriptionSuggestionLists as ItemProps[],
    });
  }, [generateName]);

  const [activeForm, expireAt] = watch(['activeForm', 'expireAt']);
  const couponType = watch('type');

  const isTranslateCoupon = router.locale !== Config.defaultLanguage;

  const onSubmit = async (values: FormValues) => {
    const input = {
      id: values?.id,
      language: router.locale,
      type: values.type,
      target: values.target,
      description: values.description,
      discountAmount: values.discountAmount,
      minimumCartAmount: values.minimumCartAmount,
      activeForm: new Date(values.activeForm).toISOString(),
      expireAt: new Date(values.expireAt).toISOString(),
      startTime: formatTime(values.startTime),
      endTime: formatTime(values.endTime),
      image: {
        thumbnail: values?.image?.photoUrl?.thumbnail,
        original: values?.image?.photoUrl?.original,
      },
    };
    try {
      if (!initialValues) {
        createCoupon({
          ...input,
          code: values.code,
          ...(initialValues?.code && { code: initialValues.code }),
          shop_id: shopId,
        });
      } else {
        updateCoupon({
          ...input,
          ...(initialValues.code !== values.code && { code: values.code }),
          id: initialValues._id!,
          shop_id: initialValues.shop_id!,
        });
      }
    } catch (error) {
      const serverErrors = getErrorMessage(error);
      Object.keys(serverErrors?.validation).forEach((field: any) => {
        setError(field.split('.')[1], {
          type: 'manual',
          message: serverErrors?.validation[field][0],
        });
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
        <Description
          title={t('form:input-label-image')}
          details={t('form:coupon-image-helper-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput name="image" control={control} multiple={false} />
        </Card>
      </div>

      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title={t('form:input-label-description')}
          details={`${
            initialValues
              ? t('form:item-description-edit')
              : t('form:item-description-add')
          } ${t('form:coupon-form-info-help-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-code')}
            {...register('code')}
            error={t(errors.code?.message!)}
            variant="outline"
            className="mb-5"
            disabled={isTranslateCoupon}
            required
          />

          <div className="relative">
            {options?.useAi && (
              <OpenAIButton
                title={t('form:button-label-description-ai')}
                onClick={handleGenerateDescription}
              />
            )}
            <TextArea
              label={t('form:input-label-description')}
              {...register('description')}
              variant="outline"
              className="mb-5"
            />
          </div>

          <div className="mb-5">
            <Label>{t('form:input-label-type')}</Label>
            <div className="space-y-3.5">
              <Radio
                label={t('form:input-label-fixed')}
                {...register('type')}
                id="fixed"
                value={CouponType.FIXED}
                error={t(errors.type?.message!)}
                disabled={isTranslateCoupon}
              />
              <Radio
                label={t('form:input-label-percentage')}
                {...register('type')}
                id="percentage"
                value={CouponType.PERCENTAGE}
                disabled={isTranslateCoupon}
              />
              <Radio
                label={t('form:input-label-free-shipping')}
                {...register('type')}
                id="free_shipping"
                value={CouponType.FREE_SHIPPING}
                disabled={isTranslateCoupon}
              />
            </div>
          </div>

          {couponType !== CouponType.FREE_SHIPPING && (
            <Input
              label={`${t('form:coupon-input-label-amount')} (${currency})`}
              {...register('discountAmount')}
              type="number"
              error={t(errors.amount?.message!)}
              variant="outline"
              className="mb-5"
              disabled={isTranslateCoupon}
            />
          )}
          <Input
            label={`${t('form:input-label-minimum-cart-amount')} (${currency})`}
            {...register('minimumCartAmount')}
            type="number"
            error={t(errors.minimum_cart_amount?.message!)}
            variant="outline"
            className="mb-5"
            disabled={isTranslateCoupon}
            required
          />

          <div className="mb-5">
            <div className="flex items-center gap-x-4">
              <SwitchInput name="target" control={control} />
              <Label className="!mb-0.5">
                {t('form:input-label-verified-customer')}
              </Label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row">
            <div className="w-full p-0 mb-5 sm:mb-0 sm:w-1/2 sm:pe-2">
              <DatePicker
                control={control}
                name="activeForm"
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
                maxDate={new Date(expireAt)}
                startDate={new Date(activeForm)}
                endDate={new Date(expireAt)}
                label={t('form:coupon-active-from')}
                className="border border-border-base"
                disabled={isTranslateCoupon}
                error={t(errors.activeForm?.message!)}
                required
              />
            </div>
            <div className="w-full p-0 sm:w-1/2 sm:ps-2">
              <DatePicker
                name="expireAt"
                dateFormat="dd/MM/yyyy"
                control={control}
                startDate={new Date(activeForm)}
                endDate={new Date(expireAt)}
                minDate={new Date(activeForm)}
                className="border border-border-base"
                disabled={isTranslateCoupon}
                error={t(errors.expireAt?.message!)}
                label={t('form:coupon-expire-at')}
                required
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row">
            <div className="w-full p-0 mb-5 sm:mb-0 sm:w-1/2 sm:pe-2">
              <TimePickerInput
                control={control}
                name="startTime"
                className="border border-border-base"
                disabled={isTranslateCoupon}
                label={t('form:store-notice-active-time')}
                error={t(errors.startTime?.message!)}
                required
              />
            </div>
            <div className="w-full p-0 sm:w-1/2 sm:ps-2">
              <TimePickerInput
                control={control}
                name="endTime"
                className="border border-border-base"
                disabled={isTranslateCoupon}
                label={t('form:store-notice-expire-time')}
                error={t(errors.startTime?.message!)}
                required
              />
            </div>
          </div>
        </Card>
      </div>
      <StickyFooterPanel className="z-0">
        <div className="text-end">
          {initialValues && (
            <Button
              variant="outline"
              onClick={router.back}
              className="me-4"
              type="button"
            >
              {t('form:button-label-back')}
            </Button>
          )}

          <Button
            loading={creating || updating}
            disabled={creating || updating}
          >
            {initialValues
              ? t('form:button-label-update-coupon')
              : t('form:button-label-add-coupon')}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
}
