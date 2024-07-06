import type { Database } from "./supabase";

export type Row<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertDto<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateDto<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];


export type Transaction = Row<'transactions'>;
export type TransactionInsertDto = InsertDto<'transactions'>;
export type TransactionUpdateDto = UpdateDto<'transactions'>;

export type Account = Row<'accounts'>;
export type AccountInsertDto = InsertDto<'accounts'>;
export type AccountUpdateDto = UpdateDto<'accounts'>;

export type Category = Row<'categories'>;
export type CategoryInsertDto = InsertDto<'categories'>;
export type CategoryUpdateDto = UpdateDto<'categories'>;

export type Vendor = Row<'vendors'>;
export type VendorInsertDto = InsertDto<'vendors'>;
export type VendorUpdateDto = UpdateDto<'vendors'>;

export type Profile = Row<'profiles'>;

export type TransactionAdjustment = Row<'transaction_adjustments'>;

export interface LiftedTransaction extends Transaction {
  account: Pick<Account, 'id' | 'name'>;
  category: Pick<Category, 'id' | 'name' | 'color'>;
  adjustments: TransactionAdjustment[];
  adjustedAmount: number;
}