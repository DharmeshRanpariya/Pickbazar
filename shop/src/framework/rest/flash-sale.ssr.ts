import { GetStaticProps } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import { API_ENDPOINTS } from './client/api-endpoints';
import client from './client';
import { SettingsQueryOptions, TypeQueryOptions } from '@/types';
import { TYPES_PER_PAGE } from './client/variables';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

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
    page: 1,
  };

  let flashSale = [];
  try {
    flashSale = await client?.flashSale?.all(options);
  } catch (error) {
    flashSale.error('Failed to fetch coupons:', error);
  }
  return {
    props: {
      flashSales: flashSale?.data,
      ...(await serverSideTranslations(locale!, ['common'])),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
    revalidate: 1296000,
  };
};
