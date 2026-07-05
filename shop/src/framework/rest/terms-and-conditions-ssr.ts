import { LIMIT_HUNDRED } from '@/lib/constants';
import type { TermsAndConditionsQueryOptions, TypeQueryOptions } from '@/types';
import { SettingsQueryOptions } from '@/types';
import type { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import { TYPES_PER_PAGE } from './client/variables';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    [API_ENDPOINTS.SETTINGS, { language: locale }],
    ({ queryKey }) => client.settings.all(queryKey[1] as SettingsQueryOptions),
  );
  await queryClient.prefetchQuery(
    [API_ENDPOINTS.TYPES, { limit: TYPES_PER_PAGE, language: locale }],
    ({ queryKey }) => client.types.all(queryKey[1] as TypeQueryOptions),
  );

  const options = {
    language: locale || 'en',
    limit: 100,
    is_approved: true,
  };

  let termsAndConditions = [];
  try {
    termsAndConditions = await client.termsAndConditions.all(options);
  } catch (error) {
    termsAndConditions.error('Failed to fetch coupons:', error);
  }
  return {
    props: {
      termsAndConditions: termsAndConditions?.data,
      ...(await serverSideTranslations(locale!, ['common', 'terms'])),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
    revalidate: 1296000,
  };
};
