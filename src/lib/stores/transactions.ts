import type { LiftedTransaction } from '$lib/types';
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

  const fetchTransactions = async (startDate: string = '', endDate: string = '') => {
    update((state) => ({ ...state, loading: true, error: null }));
    try {
      let queryPath = '/api/transactions';

      queryPath += `?startDate=${startDate}`;
      queryPath += `&endDate=${endDate}`;

      const response = await fetch(queryPath);
      const data = await response.json();

      update((state) => ({ ...state, data, loading: false }));
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

  return {
    fetchTransactions,
    updateTransaction,
    subscribe,
    set,
    update,
  };
};

const transactionStore = createStore();

export default transactionStore