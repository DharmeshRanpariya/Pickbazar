import { getLayoutWithFooter } from '@/components/layouts/layout-with-footer';
import Seo from '@/components/seo/seo';
import NotFound from '@/components/ui/not-found';
import { useTranslation } from 'next-i18next';
import PageBanner from '@/components/banners/page-banner';
import Terms from '@/components/terms/terms';
import { getCustomerStaticProps as getStaticProps } from '@/framework/refund-policies.ssr';
import { NextPageWithLayout, RefundPolicy } from '@/types';
export { getStaticProps };

interface CustomerRefundPolicyPageProps {
  refundPolicies: any[];
}
const CustomerRefundPolicyPage: NextPageWithLayout<
  CustomerRefundPolicyPageProps
> = ({ refundPolicies = [] }) => {
  const { t } = useTranslation();
  return (
    <>
      <Seo title="Customer Refund Policies" url="refund-policies" />
      <section className="mx-auto min-h-screen bg-light w-full max-w-1920 pb-8 lg:pb-10 xl:pb-14">
        <PageBanner
          title={t('nav-menu-refund-policy')}
          breadcrumbTitle={t('text-home')}
        />
        {/* End of page header */}
        <div className="mx-auto w-full max-w-screen-lg px-4 py-10">
          {!refundPolicies.length ? (
            <div className="min-h-full p-5 md:p-8 lg:p-12 2xl:p-16">
              <NotFound text="text-no-faq" className="h-96" />
            </div>
          ) : (
            <Terms isLoading terms={refundPolicies as RefundPolicy[]} />
          )}
        </div>
      </section>
    </>
  );
};

CustomerRefundPolicyPage.getLayout = getLayoutWithFooter;

export default CustomerRefundPolicyPage;
