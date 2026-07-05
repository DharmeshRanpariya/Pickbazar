import Logo from '@/components/ui/logo';
import { useTranslation } from 'next-i18next';

export default function EmailVerify() {
    const { t } = useTranslation('common');
    return (
        <>
            <div className="flex h-full min-h-screen w-screen flex-col justify-center bg-light py-6 px-5 sm:p-8 md:h-auto md:min-h-0 md:max-w-[480px] md:rounded-xl">
                <div className="flex justify-center">
                    <Logo />
                </div>
                <p className="mt-4 mb-7 px-2 text-center text-sm leading-relaxed text-body sm:mt-5 sm:mb-10 sm:px-0 md:text-base">
                {t('verification-link')}
                </p>
                <div className="flex justify-center">
                    <p className="text-lg font-semibold">{t('verification-email')}</p>
                </div>
            </div>
        </>
    );
}


