import { useState } from 'react';

export const useLazyRequest = (query) => {
  const [data, setData] = useState()
  const [isLoading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState()
  const [error, setError] = useState()
  const request = (params) => {
    setLoading(true)
    setError(null)

    return query(params)
      .then(result => {
        setData(result)
        setLastUpdated(Date.now())
      })
      .catch(err => {
        setError(err)
      })
      .finally(() => {
        setLoading(false)
      })
  };

  return [
    request,
    {
      data,
      isLoading,
      lastUpdated,
      error
    }
  ]
};

export const useRequest = (query) => {
  const [
    request,
    {
      data,
      isLoading,
      lastUpdated,
      error
    }
  ] = useLazyRequest(query);
  request();
  return {
    data,
    isLoading,
    lastUpdated,
    error
  };
}