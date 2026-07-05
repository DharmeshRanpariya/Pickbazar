import Button from '@/components/ui/button';
import Input from '@/components/ui/forms/input';
import Label from '@/components/ui/forms/label';
import Radio from '@/components/ui/forms/radio/radio';
import { Controller } from 'react-hook-form';
import TextArea from '@/components/ui/forms/text-area';
import { useTranslation } from 'next-i18next';
import * as yup from 'yup';
import { useModalState } from '@/components/ui/modal/modal.context';
import { Form } from '@/components/ui/forms/form';
import { AddressType } from '@/framework/utils/constants';
import { GoogleMapLocation } from '@/types';
import { addAddress, updateAddress } from '@/framework/user';
import GooglePlacesAutocomplete from '@/components/form/google-places-autocomplete';
import { useSettings } from '@/framework/settings';
import { useAtom } from 'jotai';
import { setNewAddress } from '@/lib/constants';
import Select from '../ui/select/select';
import { useEffect, useState } from 'react';
import { HttpClient2 } from '@/framework/client/http-client2';
import { API_ENDPOINTS } from '@/framework/client/api-endpoints';

type FormValues = {
  title: string;
  type: AddressType;
  city: string;
  state: string;
  zip: string;
  street_address: string;
  location: GoogleMapLocation;
};

const addressSchema = yup.object().shape({
  type: yup
    .string()
    .oneOf([AddressType.Billing, AddressType.Shipping])
    .required('error-type-required'),
  title: yup.string().required('error-title-required'),
  state: yup
    .mixed()
    .test('is-string-or-object', 'State is required', (value) => {
      return (
        value !== '' &&
        (typeof value === 'string' ||
          (typeof value === 'object' &&
            value !== null &&
            'label' in value &&
            'value' in value))
      );
    }),
  city: yup.mixed().test('is-string-or-object', 'City is required', (value) => {
    return (
      value !== '' &&
      (typeof value === 'string' ||
        (typeof value === 'object' &&
          value !== null &&
          'label' in value &&
          'value' in value))
    );
  }),
  zip: yup.mixed().test('is-string-or-object', 'Zip is required', (value) => {
    return (
      value !== '' &&
      (typeof value === 'string' ||
        (typeof value === 'object' &&
          value !== null &&
          'label' in value &&
          'value' in value))
    );
  }),
  street_address: yup.string().required('error-street-required'),
});

export const AddressForm: React.FC<any> = ({
  onSubmit,
  defaultValues,
  isLoading,
}) => {
  const { t } = useTranslation('common');
  const { settings } = useSettings();
  const [data, setData] = useState('');
  const addressType = defaultValues.type;

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await HttpClient2.get<any>(
        `${API_ENDPOINTS.STATE_AND_CITY}`,
      );
      setData(response);
      return response;
    } catch (error) {
      console.error('Error fetching cart data:', error);
    }
  };

  const stateOptions = Object.values(data).map((item, index) => ({
    label: item.state,
    value: index,
  }));

  const [cityOptions, setCityOptions] = useState([]);
  const [zipOptions, setZipOptions] = useState([]);

  const handleStateChange = (state, setValue) => {
    const cities = data[state]?.cities || {};
    const options = Object.keys(cities).map((city) => ({
      label: city,
      value: city,
    }));
    setCityOptions(options);
    setZipOptions([]);
    setValue('city', null);
    setValue('zip', null);
  };

  const handleCityChange = (state, city, setValue) => {
    const zips = data[state]?.cities[city] || [];
    setZipOptions(zips);
    setValue('zip', null);
  };

  return (
    <Form<FormValues>
      onSubmit={onSubmit}
      className="grid h-full grid-cols-2 gap-5"
      //@ts-ignore
      validationSchema={addressSchema}
      useFormProps={{
        shouldUnregister: true,
        defaultValues,
      }}
      resetValues={defaultValues}
    >
      {({ register, control, getValues, setValue, formState: { errors } }) => {
        return (
          <>
            <div>
              <Label>{t('text-type')}</Label>
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                {addressType === AddressType.Billing && (
                  <Radio
                    id="billing"
                    {...register('type')}
                    type="radio"
                    value={AddressType.Billing}
                    label={t('text-billing')}
                    checked
                  />
                )}
                {addressType === AddressType.Shipping && (
                  <Radio
                    id="shipping"
                    {...register('type')}
                    type="radio"
                    value={AddressType.Shipping}
                    label={t('text-shipping')}
                    checked
                  />
                )}
                {addressType === '' && (
                  <>
                    <Radio
                      id="billing"
                      {...register('type')}
                      type="radio"
                      value={AddressType.Billing}
                      label={t('text-billing')}
                    />
                    <Radio
                      id="shipping"
                      {...register('type')}
                      type="radio"
                      value={AddressType.Shipping}
                      label={t('text-shipping')}
                    />
                  </>
                )}
              </div>
            </div>

            <Input
              label={t('text-title')}
              {...register('title')}
              error={t(errors.title?.message!)}
              variant="outline"
              className="col-span-2"
            />

            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <>
                  <div className="mb-5 mx-auto" style={{ width: '100%' }}>
                    {' '}
                    <Label
                      htmlFor="image"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t('text-state')}
                    </Label>
                    <Select
                      {...field}
                      options={stateOptions}
                      placeholder={t('text-select-state')}
                      classNamePrefix="select"
                      onChange={(selected) => {
                        field.onChange(selected);
                        handleStateChange(selected.value, setValue);
                      }}
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          minHeight: '40px',
                          padding: '0.5rem',
                          borderColor: 'lightgray',
                          '&:hover': { borderColor: '#4A90E2' },
                        }),
                        menu: (provided) => ({
                          ...provided,
                          zIndex: 9999,
                        }),
                      }}
                    />
                    {errors.state && (
                      <p className="mt-2 text-xs text-red-500">
                        {t(errors.state?.message!)}
                      </p>
                    )}
                  </div>
                </>
              )}
            />

            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <>
                  <div className="mb-5 mx-auto" style={{ width: '100%' }}>
                    {' '}
                    <Label
                      htmlFor="image"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t('text-city')}
                    </Label>
                    <Select
                      {...field}
                      options={cityOptions}
                      placeholder={t('text-select-city')}
                      classNamePrefix="select"
                      onChange={(selected) => {
                        field.onChange(selected);
                        handleCityChange(
                          getValues('state').value,
                          selected.value,
                          setValue,
                        );
                      }}
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          minHeight: '40px',
                          padding: '0.5rem',
                          borderColor: 'lightgray',
                          '&:hover': { borderColor: '#4A90E2' },
                        }),
                        menu: (provided) => ({
                          ...provided,
                          zIndex: 9999,
                        }),
                      }}
                    />
                    {errors.city && (
                      <p className="mt-2 text-xs text-red-500">
                        {t(errors.city?.message!)}
                      </p>
                    )}
                  </div>
                </>
              )}
            />

            <Controller
              name="zip"
              control={control}
              render={({ field }) => (
                <>
                  <div className="col-span-2 mb-5" style={{ width: '100%' }}>
                    {' '}
                    {/* Fixed width with full responsiveness */}
                    <Label
                      htmlFor="zip"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t('text-zip')}
                    </Label>
                    <Select
                      {...field}
                      options={zipOptions.map((zip) => ({
                        label: zip,
                        value: zip,
                      }))}
                      placeholder={t('text-select-zip')}
                      classNamePrefix="select"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          minHeight: '40px',
                          padding: '0.5rem',
                          borderColor: 'lightgray',
                          '&:hover': { borderColor: '#4A90E2' },
                        }),
                        menu: (provided) => ({
                          ...provided,
                          zIndex: 9999,
                        }),
                      }}
                    />
                    {errors.zip && (
                      <p className="mt-2 text-xs text-red-500">
                        {t(errors.zip?.message!)}
                      </p>
                    )}
                  </div>
                </>
              )}
            />

            <TextArea
              label={t('text-street-address')}
              {...register('street_address')}
              error={t(errors.street_address?.message!)}
              variant="outline"
              className="col-span-2"
            />

            <Button
              className="w-full col-span-2"
              loading={isLoading}
              disabled={isLoading}
            >
              {defaultValues.title === '' ? t('text-save') : t('text-update')}{' '}
              {t('text-address')}
            </Button>
          </>
        );
      }}
    </Form>
  );
};

export default function CreateOrUpdateAddressForm({ data }) {
  const { t } = useTranslation('common');
  const {
    data: { customerId, address, type },
  } = useModalState();
  const { mutate: createAddress } = addAddress();
  const { mutate: updatedAddress } = updateAddress();

  const [oldAddress, setAddress] = useAtom(setNewAddress);
  const onSubmit = (values: FormValues) => {
    const formattedInput = {
      id: address?._id,
      customer_id: customerId,
      title: values.title,
      type: values.type,
      city: values.city?.label,
      state: values.state?.label,
      zip: values.zip?.label,
      street_address: values.street_address,
      location: values.location,
    };
    if (address) {
      updatedAddress({
        addressId: address._id,
        ...formattedInput,
      });
    } else {
      createAddress(formattedInput);
    }

    setAddress([
      ...oldAddress.filter((i: any) => i?.id !== address?._id),

      {
        id: address?._id ? address?._id : new Date().toISOString(),
        title: values.title,
        type: values.type,
        city: values.city,
        state: values.state,
        zip: values.zip,
        street_address: values.street_address,
        location: values.location,
      },
    ] as any);
  };
  return (
    <div className="min-h-screen p-5 bg-light sm:p-8 md:min-h-0 md:rounded-xl">
      <h1 className="mb-4 text-lg font-semibold text-center text-heading sm:mb-6">
        {address ? t('text-update') : t('text-add-new')} {t('text-address')}{' '}
      </h1>
      <AddressForm
        onSubmit={onSubmit}
        defaultValues={{
          title: address?.title ?? '',
          type: address?.type ?? data.type,
          city: address?.city
            ? { value: address?.city, label: address?.city }
            : '',
          state: address?.state
            ? { value: address?.state, label: address?.state }
            : '',
          zip: address?.zip ? { value: address?.zip, label: address?.zip } : '',
          street_address: address?.street_address ?? '',
          location: address?.location ?? { lat: 0, lng: 0 },
        }}
      />
    </div>
  );
}
