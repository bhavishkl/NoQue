import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json())

export function useApi(url) {
  const { data, error, mutate } = useSWR(url, fetcher)

  return {
    data,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}