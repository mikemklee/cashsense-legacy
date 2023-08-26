import type { Account } from '$lib/types';
import toast from 'svelte-french-toast';
import { writable } from 'svelte/store';

interface ApiResponse<T> {
  data: Account[];
  loading: boolean;
  error: Error | null;
}

const createStore = <T>() => {
  const { subscribe, set, update } = writable<ApiResponse<T>>({
    data: [],
    loading: false,
    error: null
  });

  const fetchAccounts = async () => {
    update((state) => ({ ...state, loading: true, error: null }));
    try {
      const response = await fetch('/api/accounts');
      const data = await response.json();

      update((state) => ({ ...state, data, loading: false }));
      return data;
    } catch (error) {
      update((state) => ({ ...state, loading: false, error: error as Error, }));
    }
  }

  const deleteAccount = async (id: string) => {
    update((state) => ({ ...state, loading: true, error: null }));

    try {
      const response = await fetch(`/api/accounts?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        update((state) => {
          const updatedData = state.data.filter((account) => account.id !== id);
          return { ...state, data: updatedData, loading: false }
        });

        toast.success(`Account deleted`);
      } else {
        throw response
      }
    } catch (error) {
      console.error(error)
      update((state) => ({ ...state, loading: false, error: error as Error }));
      toast.error(`Something went wrong while deleting account`);
    }
  }

  return {
    fetchAccounts,
    deleteAccount,
    subscribe,
    set,
    update,
  };
};

const accountStore = createStore();

export default accountStore