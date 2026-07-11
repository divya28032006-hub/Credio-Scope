import { useCallback, useEffect, useState } from 'react';
import { api, getErrorMessage } from '../api/client';

export const useTransactions = (initialFilters = {}) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ type: '', category: '', search: '', month: '', ...initialFilters });

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;

      const { data } = await api.get('/transactions', { params });

      // Month filter applied client-side since the backend doesn't expose a month param
      let list = data.transactions || [];
      if (filters.month) {
        list = list.filter((t) => t.date?.slice(0, 7) === filters.month);
      }
      setTransactions(list);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const createTransaction = async (payload) => {
    const { data } = await api.post('/transactions', payload);
    await fetchTransactions();
    return data;
  };

  const updateTransaction = async (id, payload) => {
    const { data } = await api.put(`/transactions/${id}`, payload);
    await fetchTransactions();
    return data;
  };

  const deleteTransaction = async (id) => {
    await api.delete(`/transactions/${id}`);
    await fetchTransactions();
  };

  return {
    transactions,
    loading,
    error,
    filters,
    setFilters,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions
  };
};