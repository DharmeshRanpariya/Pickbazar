import { Controller, SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { Form } from '@/components/ui/forms/form';
import PhoneInput from '@/components/ui/forms/phone-input';
import Button from '@/components/ui/button';
import * as yup from 'yup';
import { forwardRef } from 'react';

type FormValues = {
  phoneNumber: string;
};

const checkoutContactSchema = yup.object().shape({
  phoneNumber: yup
    .string()
    .required('error-contact-required')
    .matches(/^\d{12}$/, 'error-contact-10-digit'),
});

interface PhoneNumberFormProps {
  onSubmit: SubmitHandler<FormValues>;
  phoneNumber?: string;
  isLoading?: boolean;
  view?: 'login' | undefined;
}
const PhoneInputWithRef = forwardRef((props, ref) => (
  <PhoneInput {...props} innerRef={ref} />
));

export default function PhoneNumberForm({
  phoneNumber,
  onSubmit,
  isLoading,
  view,
}: PhoneNumberFormProps) {
  const { t } = useTranslation('common');
  return (
    <Form<FormValues>
      onSubmit={onSubmit}
      validationSchema={checkoutContactSchema}
      className="w-full"
      useFormProps={{
        defaultValues: {
          phoneNumber: phoneNumber,
        },
      }}
    >
      {({ control, formState: { errors } }) => (
        <div className="flex flex-col">
          <div className="flex w-full items-center md:min-w-[360px]">
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <PhoneInputWithRef
                  {...field}
                  country="in"
                  inputClass="!p-0 ltr:!pr-4 rtl:!pl-4 ltr:!pl-14 rtl:!pr-14 !flex !items-center !w-full !appearance-none !transition !duration-300 !ease-in-out !text-heading !text-sm focus:!outline-none focus:!ring-0 !border !border-border-base ltr:!border-r-0 rtl:!border-l-0 !rounded ltr:!rounded-r-none rtl:!rounded-l-none focus:!border-accent !h-12"
                  dropdownClass="focus:!ring-0 !border !border-border-base !shadow-350"
                />
              )}
            />
            <Button
              className="!text-sm ltr:!rounded-l-none rtl:!rounded-r-none"
              loading={isLoading}
              disabled={isLoading}
            >
              {view === 'login' ? (
                t('text-send-otp')
              ) : (
                <>
                  {Boolean(phoneNumber) ? t('text-update') : t('text-add')}{' '}
                  {t('nav-menu-contact')}
                </>
              )}
            </Button>
          </div>
          {errors.phoneNumber?.message && (
            <p className="mt-2 text-xs text-red-500 ltr:text-left rtl:text-right">
              {t(errors.phoneNumber.message)}
            </p>
          )}
        </div>
      )}
    </Form>
  );
}
