import { Address } from '@/types';

function removeFalsy(obj: Record<string, any>) {
  return Object.keys(obj)
    .filter(k => obj[k])
    .reduce((acc, k) => ({ ...acc, [k]: obj[k] }), {});
}

export function formatAddress(address: Address) {
  if (!address) return '';
  const addresses = Array.isArray(address) ? address : [address];
  const formattedAddresses = addresses?.map(addr => {
    const temp = ['street_address', 'state', 'city', 'zip', 'country'].reduce(
      (acc, k) => ({ ...acc, [k]: (addr as any)[k] }),
      {}
    );
    const formattedAddress = removeFalsy(temp);
    return Object.values(formattedAddress).join(', ');
  });

  return formattedAddresses.join('; ');
}
