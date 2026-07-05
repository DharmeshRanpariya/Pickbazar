import PageBanner from '@/components/banners/page-banner';
import FlashSaleCard from '@/components/flash-sale/flash-sale';
import { getLayoutWithFooter } from '@/components/layouts/layout-with-footer';
import NotFound from '@/components/ui/not-found';
import type { NextPageWithLayout } from '@/types';
import { isEmpty } from 'lodash';
import { useTranslation } from 'next-i18next';
export { getStaticProps } from '@/framework/flash-sale.ssr';

interface FlashSalePageProps {
  flashSales: any[];
}
const FlashDealsPage: NextPageWithLayout<FlashSalePageProps> = ({
  flashSales = [],
}) => {
  const { t } = useTranslation('common');

  return (
    <div className="grow bg-[#F9F9F9] pb-8 lg:pb-10 xl:pb-14">
      <PageBanner
        title={t('text-available-flash-sale')}
        breadcrumbTitle={t('text-home')}
      />
      <div className="mx-auto max-w-[94.75rem]">
        <div className="px-4 py-10 pt-20">
          {!isEmpty(flashSales) ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              <FlashSaleCard flashSales={flashSales as any} />
            </div>
          ) : (
            <NotFound text="text-no-flash-deal" className="h-96" />
          )}
        </div>
      </div>
    </div>
  );
};

FlashDealsPage.getLayout = getLayoutWithFooter;

export default FlashDealsPage;
