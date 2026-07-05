import type { GetServerSideProps } from 'next';
import type { NextPageWithLayout } from '@/types';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Details from '@/components/products/details/details';
import ReviewCard from '@/components/reviews/review-card';
import { useReview } from '@/framework/review';
import { AttributesProvider } from '@/components/products/details/attributes.context';
import ErrorMessage from '@/components/ui/error-message';
import { getLayoutWithFooter } from '@/components/layouts/layout-with-footer';
import CartCounterButton from '@/components/cart/cart-counter-button';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';

const ProductPage: NextPageWithLayout = () => {
  const { t } = useTranslation('common');

  const router = useRouter();
  const { slug } = router.query;

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  let [productName, productId] = slug ? slug.split('&') : [];
  productId = productId.split('=')[1];
  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/product/${productId}`,
        );
        setProduct(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProduct();
  }, [productId]);

  // Fetch reviews
  const {
    review,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useReview({
    id: productId,
  });

  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <AttributesProvider>
        <Details product={product} backBtn={false} isModal={true} />
        <ReviewCard
          reviews={review}
          isLoading={reviewsLoading}
          error={reviewsError}
        />
        <CartCounterButton />
      </AttributesProvider>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common'])),
    },
  };
};

ProductPage.getLayout = getLayoutWithFooter;

export default ProductPage;
