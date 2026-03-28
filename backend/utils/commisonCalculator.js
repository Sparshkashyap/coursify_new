export const calculateCommissionBreakdown = ({
  amount,
  platformFeeRate = 20,
  affiliateCommission = 0,
}) => {
  const safeAmount = Number(amount || 0);
  const safePlatformFeeRate = Number(platformFeeRate || 0);
  const safeAffiliateCommission = Number(affiliateCommission || 0);

  const platformFeeAmount = Number(
    ((safeAmount * safePlatformFeeRate) / 100).toFixed(2)
  );

  const instructorEarningAmount = Number(
    (safeAmount - platformFeeAmount).toFixed(2)
  );

  const adminNetRevenueAmount = Number(
    Math.max(platformFeeAmount - safeAffiliateCommission, 0).toFixed(2)
  );

  return {
    totalAmount: safeAmount,
    platformFeeRate: safePlatformFeeRate,
    platformFeeAmount,
    affiliateCommission: safeAffiliateCommission,
    adminNetRevenueAmount,
    instructorEarningAmount,
  };
};