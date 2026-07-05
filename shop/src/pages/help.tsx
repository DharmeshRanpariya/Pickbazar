import Seo from '@/components/seo/seo';
import NotFound from '@/components/ui/not-found';
import { useTranslation } from 'next-i18next';
import { getStaticProps } from '@/framework/faq-ssr';
export { getStaticProps };
import { getLayoutWithFooter } from '@/components/layouts/layout-with-footer';
import PageBanner from '@/components/banners/page-banner';
import FAQ from '@/components/faq/faq';
import { NextPageWithLayout } from '@/types';

interface FaqPageProps {
  faqs: any[];
}

const HelpPage: NextPageWithLayout<FaqPageProps> = ({ faqs = [] }) => {
  const { t } = useTranslation();

  return (
    <>
      <Seo title="Help" url="help" />
      <section className="w-full min-h-screen pb-16 mx-auto max-w-1920 bg-light lg:pb-10 xl:pb-14">
        <PageBanner
          title={t('text-faq-title')}
          breadcrumbTitle={t('text-home')}
        />
        <div className="w-full max-w-screen-lg px-4 py-10 mx-auto">
          {!faqs.length ? (
            <div className="min-h-full p-5 md:p-8 lg:p-12 2xl:p-16">
              <NotFound text="text-no-faq" className="h-96" />
            </div>
          ) : (
            <FAQ data={faqs as any} />
          )}
        </div>
      </section>
    </>
  );
};

HelpPage.getLayout = getLayoutWithFooter;

export default HelpPage;
