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