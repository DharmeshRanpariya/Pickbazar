import React from 'react';
import { useModalState,useModalAction  } from '@/components/ui/modal/modal.context';
import { Form } from '@/components/ui/forms/form';
import Input from '@/components/ui/forms/input';
import TextArea from '@/components/ui/forms/text-area';
import Button from '@/components/ui/button';
import * as yup from 'yup';
import { useTranslation } from 'next-i18next';
import client from '../../framework/rest/client';
import { toast } from 'react-toastify';

interface FormValues {
  cancelReason: string;
  cancelDescription: string;
}

const refundFormSchema = yup.object().shape({
  cancelReason: yup.string().required('Cancel reason is required'),
  cancelDescription: yup.string().required('Description is required'),
});

const OrderCancelForm = () => {
  const { t } = useTranslation('common');
  const { data: orderId } = useModalState();
  const { closeModal } = useModalAction(); 
  const [isSubmitting, setSubmitting] = React.useState(false);

  async function handleRefundRequest({
    cancelReason,
    cancelDescription,
  }: FormValues) {
    try {
      setSubmitting(true);
      const cancelInput = {
        cancelReason,
        cancelDescription,
      };

      if (!orderId) {
        throw new Error('Order ID is not available');
      }

      await client.orders.cancel(orderId, cancelInput);
      toast.success(t('Order canceled successfully!'));
      closeModal();
    } catch (error: any) {
      toast.error(t('Error canceling order. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex h-full min-h-screen w-screen flex-col justify-center bg-light py-6 px-5 sm:p-8 md:h-auto md:min-h-0 md:max-w-[480px] md:rounded-xl">
      <h1 className="mb-5 text-lg font-semibold text-center text-heading sm:mb-6">
        {t('text-cancel-order')}
      </h1>

      {/* Form component */}
      <Form<FormValues>
        onSubmit={handleRefundRequest}
        validationSchema={refundFormSchema}
      >
        {({ register, formState: { errors } }) => (
          <>
            <Input
              label={t('Cancel Reason')}
              {...register('cancelReason')}
              type="text"
              variant="outline"
              className="mb-5"
              error={t(errors.cancelReason?.message!)}
            />

            <TextArea
              label={t('Description')}
              {...register('cancelDescription')}
              variant="outline"
              className="mb-5"
              error={t(errors.cancelDescription?.message!)}
            />

            <div className="mt-8">
              <Button
                className="w-full h-11 sm:h-12"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {t('Submit')}
              </Button>
            </div>
          </>
        )}
      </Form>
    </div>
  );
};

export default OrderCancelForm;
