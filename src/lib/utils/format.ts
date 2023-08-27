import type { LiftedTransaction, TransactionAdjustment } from "$lib/types";

export const humanizeAccountType = (type: string) => {
  switch (type) {
    case 'bank_account':
      return 'Bank account';
    case 'credit_card':
      return 'Credit card';
    default:
      return 'Unknown';
  }
};

export const formatAdjustedAmount = (transaction: LiftedTransaction) => {
  let amountAfterAdjustments =
    transaction.amount +
    transaction.adjustments.reduce(
      (acc: number, adjustment: TransactionAdjustment) => acc + adjustment.amount,
      0);
  return {
    ...transaction,
    adjustedAmount: amountAfterAdjustments
  }
}