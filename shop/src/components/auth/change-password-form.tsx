import Button from '@/components/ui/button';
import PasswordInput from '@/components/ui/forms/password-input';
import { useTranslation } from 'next-i18next';
import { Form } from '@/components/ui/forms/form';
import { useChangePassword } from '@/framework/user';
import * as yup from 'yup';
import { ChangePasswordUserInput } from '@/types';

const changePasswordSchema = yup.object().shape({
  oldPassword: yup.string().required('error-old-password-required'),
  newPassword: yup
    .string()
    .required('error-new-password-required')
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*()_+])[A-Za-z0-9!@#$%^&*()_+]{8,}$/,
      'error-password-weak'
    ),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'error-match-passwords')
    .required('error-confirm-password'),
});

export default function ChangePasswordForm() {
  const { t } = useTranslation('common');
  const { mutate: changePassword, isLoading: loading, formError } = useChangePassword();

  const onSubmit = async ({ newPassword, oldPassword }: ChangePasswordUserInput) => {
    try {
      await changePassword({ oldPassword, newPassword });
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  return (
    <Form
      onSubmit={onSubmit}
      validationSchema={changePasswordSchema}
      className="flex flex-col"
      serverError={formError}
    >
      {({ register, formState: { errors } }) => (
        <>
          <PasswordInput
            label={t('text-old-password')}
            {...register('oldPassword')}
            error={t(errors.oldPassword?.message)}
            className="mb-5"
            variant="outline"
          />
          <PasswordInput
            label={t('text-new-password')}
            {...register('newPassword')}
            error={t(errors.newPassword?.message)}
            className="mb-5"
            variant="outline"
          />
          <PasswordInput
            label={t('text-confirm-password')}
            {...register('passwordConfirmation')}
            error={t(errors.passwordConfirmation?.message)}
            className="mb-5"
            variant="outline"
          />
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            className="ltr:ml-auto rtl:mr-auto"
          >
            {t('text-submit')}
          </Button>
          {formError && formError.oldPassword === 'error-password-mismatch' && (
            <div className="text-red-500 mt-2">{t('error-password-mismatch')}</div>
          )}
        </>
      )}
    </Form>
  );
}
