import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import AttributeList from '@/components/attribute/attribute-list';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SortOrder } from '@/types';
import { useState } from 'react';
import { admin } from '@/utils/auth-utils';
import { useRouter } from 'next/router';
import { useAttributesQuery } from '@/data/attributes';
import PageHeading from '@/components/common/page-heading';
import { Config } from '@/config';
import LinkButton from '@/components/ui/link-button';

export default function AttributePage() {
  const { t } = useTranslation();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const { locale } = useRouter();

  const { attributes, loading, error } = useAttributesQuery({
    orderBy,
    sortedBy,
    language: locale,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <Card className="mb-8 flex flex-row items-center justify-between">
        <div className="md:w-1/4">
          <PageHeading title={t('common:sidebar-nav-item-attributes')} />
        </div>
        <div className="flex flex-col space-y-4 ms-auto md:flex-row md:space-y-0">
          {locale === Config.defaultLanguage && (
            <LinkButton
              href={`/clothing/attributes/create`}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span className="text-[12px] sm:text-base">
                + {t('form:button-label-add-attributes')}
              </span>
            </LinkButton>
          )}
        </div>
      </Card>
      <AttributeList
        attributes={attributes}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}

AttributePage.authenticate = {
  permissions: admin,
};

AttributePage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
