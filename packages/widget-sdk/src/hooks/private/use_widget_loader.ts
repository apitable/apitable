import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCounter } from 'ahooks';
import { loadWidget, WidgetLoadError } from '../../initialize_widget';

export function useWidgetComponent(
  codeUrl?: string, widgetPackageId?: string):
  [React.FC | undefined, () => void, boolean, WidgetLoadError | undefined] {
  const componentRef = useRef<React.FC>();
  const [loading, setLoading] = useState(false);
  const [count, { inc: refreshVersion }] = useCounter(0);
  const [error, setError] = useState<WidgetLoadError>();
  const preCount = useRef<number>(count);
  const preCodeUrl = useRef<string>();

  useEffect(() => {
    setLoading(true);
    if (!codeUrl || !widgetPackageId) {
      componentRef.current = undefined;
      setLoading(false);
      return;
    }

    loadWidget(codeUrl, widgetPackageId,
      // 当刷新版本 或者 传入的 codeUrl 变化时候就重新加载小程序代码包
      count > preCount.current || (Boolean(preCodeUrl.current) && preCodeUrl.current !== codeUrl)
    ).then(component => {
      componentRef.current = component;
      setLoading(false);
      setError(undefined);
    }).catch(error => {
      setError(error);
    }).then(() => {
      preCount.current = count;
      preCodeUrl.current = codeUrl;
    });
  }, [codeUrl, count, setLoading, widgetPackageId]);

  const refresh = useCallback(() => {
    componentRef.current = undefined;
    refreshVersion();
  }, [refreshVersion]);

  return useMemo(() => [componentRef.current, refresh, loading, error], [error, loading, refresh]);
}
