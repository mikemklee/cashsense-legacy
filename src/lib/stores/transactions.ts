import type { LiftedTransaction } from '$lib/types';
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
      update((state) => ({ ...state, loading: false, error: error as Error, }));
    }

  }

  return {
    fetchTransactions,
    subscribe,
    set,
    update,
  };
};

const transactionStore = createStore();

export default transactionStore