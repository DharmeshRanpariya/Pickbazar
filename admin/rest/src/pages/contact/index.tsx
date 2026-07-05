import { useRouter } from 'next/router';
import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import { useState } from 'react';
import { LIMIT } from '@/utils/constants';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { admin } from '@/utils/auth-utils';
import { GetStaticProps } from 'next';
import PageHeading from '@/components/common/page-heading';
import { useContactQuery } from '@/data/contact';
import ContactList from '@/components/contact/contact-list';

export default function Contact() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [page, setPage] = useState(1);

  const { contact, loading, paginatorInfo, error } = useContactQuery({
    limit: LIMIT,
    page,
    language: locale,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handlePagination(current: number) {
    setPage(current);
  }

  return (
    <>
      <Card className="mb-8 flex flex-col items-center md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <PageHeading title={t('common:text-contact')} />
        </div>
      </Card>

      <ContactList
        contact={contact}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
      />
    </>
  );
}
Contact.authenticate = {
  permissions: admin,
};
Contact.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['form', 'common', 'table'])),
  },
});
