export const DELIVERY_FEES = {
  SERVICE_FEE: 0.99,
  BASE_DELIVERY_FEE: 8.99,
};

export const calculateDeliveryFees = (pickup = false) => ({
  serviceFee: DELIVERY_FEES.SERVICE_FEE,
  deliveryFee: pickup ? 0 : DELIVERY_FEES.BASE_DELIVERY_FEE,
  // Helper method to get total fees
  getTotalFees: () => DELIVERY_FEES.SERVICE_FEE + (pickup ? 0 : DELIVERY_FEES.BASE_DELIVERY_FEE)
});