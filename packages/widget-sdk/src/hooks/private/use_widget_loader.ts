import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCounter } from 'ahooks';
import { loadWidget, WidgetLoadError } from '../../initialize_widget';

export function useWidgetComponent(
  codeUrl?: string, widgetPackageId?: string):
  [React.FC | undefined, () => void, boolean, WidgetLoadError | undefined] {
  const componentRef = useRef<React.FC>();
  // if need to load the widget package.
  const validate = Boolean(codeUrl && widgetPackageId);
  const [loading, setLoading] = useState(validate);
  const [count, { inc: refreshVersion }] = useCounter(0);
  const [error, setError] = useState<WidgetLoadError>();
  const preCount = useRef<number>(count);
  const preCodeUrl = useRef<string>();

  useEffect(() => {
    if (!validate) {
      componentRef.current = undefined;
      return;
    }

    loadWidget(codeUrl!, widgetPackageId!,
      // when version is refreshed or incoming codeUrl changes, the widget code package is reloaded
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
  }, [codeUrl, count, setLoading, widgetPackageId, validate]);

  const refresh = useCallback(() => {
    componentRef.current = undefined;
    setLoading(true);
    refreshVersion();
  }, [refreshVersion]);

  return useMemo(() => [componentRef.current, refresh, loading, error], [error, loading, refresh]);
}
