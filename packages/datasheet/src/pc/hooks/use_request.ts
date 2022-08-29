import { useRequest as useRequestV3 } from 'ahooks';
import { Service, Options } from 'ahooks/lib/useRequest/src/types';

type Result<TData, TParams extends any[]> = {
  data: TData | undefined;
  run: (...params: TParams) => Promise<TData>;
  error: Error | undefined;
  loading: boolean;
  mutate: (data?: TData | ((oldData?: TData) => TData | undefined)) => void;
  cancel: () => void;
};

export function useRequest<TData, TParams extends any[] = any[]>(
  service: Service<TData, TParams>,
  options?: Options<TData, TParams>
): Result<TData, TParams> {
  const { data, runAsync, error, loading, mutate, cancel } = useRequestV3(
    service,
    options
  );

  return {
    data,
    run: runAsync,
    error,
    loading,
    mutate,
    cancel,
  };
}
