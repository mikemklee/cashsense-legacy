import type { LiftedTransaction, TransactionAdjustment } from '$lib/types';
import toast from 'svelte-french-toast';
import { writable } from 'svelte/store';

interface ApiResponse<T> {
  data: LiftedTransaction[];
  loading: boolean;
  error: Error | null;
}

const createStore = <T>() => {
  const { subscribe, set, update } = writable<ApiResponse<T>>({
    data: [],
    loading: false,
    error: null
  });

  const createTransaction = async (createData: any) => {
    update((state) => ({ ...state, loading: true, error: null }));

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createData)
      });

      const [createdTransaction] = await response.json();

      update((state) => ({
        ...state, data: [
          ...state.data,
          createdTransaction
        ], loading: false,
      }));

      toast.success(`Transaction record created`);
    } catch (error) {
      console.error(error)
      update((state) => ({ ...state, loading: false, error: error as Error }));
      toast.error(`Something went wrong while creating transaction record`);
    }
  }

  const fetchTransactions = async (startDate: string = '', endDate: string = '', searchTerm = '') => {
    update((state) => ({ ...state, loading: true, error: null }));
    try {
      let queryPath = '/api/transactions';
      queryPath += `?searchTerm=${searchTerm}`;
      queryPath += `&startDate=${startDate}`;
      queryPath += `&endDate=${endDate}`;

      const response = await fetch(queryPath);
      const data = await response.json();

      const formattedData = data.map((transaction: any) => {
        let amountAfterAdjustments =
          transaction.amount +
          transaction.adjustments.reduce(
            (acc: number, adjustment: TransactionAdjustment) => acc + adjustment.amount,
            0);
        return {
          ...transaction,
          adjustedAmount: amountAfterAdjustments
        }
      });

      update((state) => ({ ...state, data: formattedData, loading: false }));
      return data;
    } catch (error) {
      update((state) => ({ ...state, loading: false, error: error as Error }));
    }
  }

  const updateTransaction = async (updateData: any) => {
    update((state) => ({ ...state, loading: true, error: null }));
    try {

      const response = await fetch('/api/transactions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      const [updatedRecord] = await response.json();

      update((state) => {
        const updatedData = state.data
          .map((transaction) => transaction.id === updatedRecord.id
            ? updatedRecord
            : transaction
          );
        return { ...state, data: updatedData, loading: false }
      });

      toast.success(`Transaction record updated`);
    } catch (error) {
      update((state) => ({ ...state, loading: false, error: error as Error }));
      toast.error(`Something went wrong while updating transaction`);
    }
  }

  const upsertTransactionAdjustments = async (updateData: any) => {
    update((state) => ({ ...state, loading: true, error: null }));
    try {
      await fetch('/api/transaction_adjustments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
    } catch (error) {
      update((state) => ({ ...state, loading: false, error: error as Error }));
    }
  }

  const deleteTransactionAdjustments = async (idsToDelete: any) => {
    update((state) => ({ ...state, loading: true, error: null }));
    try {
      await fetch('/api/transaction_adjustments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(idsToDelete)
      });
    } catch (error) {
      update((state) => ({ ...state, loading: false, error: error as Error }));
    }
  }

  return {
    createTransaction,
    fetchTransactions,
    updateTransaction,
    upsertTransactionAdjustments,
    deleteTransactionAdjustments,
    subscribe,
    set,
    update,
  };
};

const transactionStore = createStore();

export default transactionStore