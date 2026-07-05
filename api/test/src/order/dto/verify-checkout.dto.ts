export class CheckoutVerificationDto {
  amount: number;
  products: [];
  billing_address?: [];
  shipping_address?: [];
  customer_id?: string;
}

export class VerifiedCheckoutData {
  total_tax: number;
  shipping_charge: number;
  unavailable_products: number[];
  wallet_currency: number;
  wallet_amount: number;
}
