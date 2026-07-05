import { LIMIT } from '@/lib/constants';
import { RefundPolicyQueryOptions, SettingsQueryOptions } from '@/types';
import type { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import { pages } from 'next/dist/build/templates/app-page';

export const getCustomerStaticProps: GetStaticProps = async ({ locale }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    [API_ENDPOINTS.SETTINGS, { language: locale }],
    ({ queryKey }) => client.settings.all(queryKey[1] as SettingsQueryOptions),
  );
  const options = {
    searchJoin: 'and',
    limit: 100,
    language: locale || 'en',
    page: 1,
    target: 'customer',
    status: 'approved',
  };

  let refundPolicies = [];
  try {
    refundPolicies = await client.refundPolicies.all(options);
  } catch (error) {
    refundPolicies.error('Failed to fetch coupons:', error);
  }
  return {
    props: {
      refundPolicies: refundPolicies?.data,
      ...(await serverSideTranslations(locale!, ['common'])),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
