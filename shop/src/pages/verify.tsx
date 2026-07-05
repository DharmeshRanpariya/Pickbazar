import { useEmailVerification } from '@/framework/user';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
export { getStaticProps } from '@/framework/general.ssr';

export default function Verify() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const token = router.query.token;

  useEffect(() => {
    handleResendEmail()
  }, [token]);

  const handleResendEmail = () => {
    if (token) {
        resendEmail(token);
    }
  };
  const { mutate: resendEmail } = useEmailVerification();

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center bg-[#F4F6F7] py-5 px-4 md:py-8">
      <div className="max-w-[36rem]">
        <div className="bg-white text-center shadow-900 md:px-[4.375rem] md:py-[2.875rem] rounded-lg">
          <h2 className="mb-5 mt-2 text-2xl font-semibold text-gray-800">
            {t('verify-email')}
          </h2>
          <p className="mb-16 text-lg text-[#969FAF]">{t('confirm-email')}</p>
        </div>
      </div>
    </section>
  );
}
