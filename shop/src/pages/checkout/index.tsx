import { getLayout } from '@/components/layouts/layout';
import Seo from '@/components/seo/seo';
import { useUser } from '@/framework/user';
import { AddressType } from '@/framework/utils/constants';
import { setNewAddress } from '@/lib/constants';
import { billingAddressAtom, shippingAddressAtom } from '@/store/checkout';
import { useAtom } from 'jotai';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
export { getStaticProps } from '@/framework/general.ssr';

const AddressGrid = dynamic(
  () => import('@/components/checkout/address-grid'),
  { ssr: false },
);
const ContactGrid = dynamic(
  () => import('@/components/checkout/contact/contact-grid'),
  // { ssr: false }
);
const RightSideView = dynamic(
  () => import('@/components/checkout/right-side-view'),
  { ssr: false },
);
const CustomerName = dynamic(
  () => import('@/components/checkout/customer-name'),
  { ssr: false },
);

export default function CheckoutPage() {
  const { t } = useTranslation();
  const { me } = useUser();
  const { id, address, phoneNumber } = me ?? {};
  const [newAddress, setAddress] = useAtom(setNewAddress);
  const [billingAddress, setBillingAddress] = useAtom(billingAddressAtom);
  const [shippingAddress, setShippingAddress] = useAtom(shippingAddressAtom);
  const [useSameAsShipping, setUseSameAsShipping] = useState(true);

  useEffect(() => {
    // @ts-ignore
    setAddress(address);
    setShippingAddress(
      address?.filter((item: any) => item.type === AddressType.Shipping),
    );
  }, [address, setAddress, setShippingAddress]);

  useEffect(() => {
    if (useSameAsShipping) {
      // Synchronize billing with shipping if useSameAsShipping is true
      setBillingAddress(shippingAddress);
    }
  }, [useSameAsShipping, shippingAddress, setBillingAddress]);

  return (
    <>
      <Seo noindex={true} nofollow={true} />
      <div className="bg-gray-100 px-4 py-8 lg:py-10 lg:px-8 xl:py-14 xl:px-16 2xl:px-20">
        <div className="m-auto flex w-full max-w-5xl flex-col items-center rtl:space-x-reverse lg:flex-row lg:items-start lg:space-x-8">
          <div className="w-full space-y-6 lg:max-w-2xl">
            <ContactGrid
              className="bg-light p-5 shadow-700 md:p-8"
              contact={phoneNumber}
              label={t('text-contact-number')}
              count={1}
            />
            <CustomerName label={t('Name')} count={2} />
            <AddressGrid
              userId={me?.id!}
              className="bg-light p-5 shadow-700 md:p-8"
              label={t('text-shipping-address')}
              count={3}
              //@ts-ignore
              addresses={newAddress?.filter(
                (item: any) => item?.type === AddressType.Shipping,
              )}
              //@ts-ignore
              atom={shippingAddressAtom}
              type={AddressType.Shipping}
            />

            <div className="flex items-center space-x-2 bg-light p-5 shadow-700 md:p-8">
              <label className="flex items-center">
                <input
                  type="radio"
                  id="useSameAsShipping"
                  checked={useSameAsShipping}
                  onClick={() => setUseSameAsShipping(!useSameAsShipping)}
                  className="mr-2"
                />
                <span className="ml-2">{t('text-same-address')}</span>
              </label>
            </div>
            {!useSameAsShipping && (
              <AddressGrid
                userId={id!}
                className="bg-light p-5 shadow-700 md:p-8"
                label={t('text-billing-address')}
                count={4}
                // @ts-ignore
                addresses={newAddress?.filter(
                  (item: any) => item?.type === AddressType.Billing,
                )}
                //@ts-ignore
                atom={billingAddressAtom}
                type={AddressType.Billing}
              />
            )}
          </div>
          <div className="mt-10 mb-10 w-full sm:mb-12 lg:mb-0 lg:w-96">
            <RightSideView />
          </div>
        </div>
      </div>
    </>
  );
}
CheckoutPage.authenticationRequired = true;
CheckoutPage.getLayout = getLayout;
