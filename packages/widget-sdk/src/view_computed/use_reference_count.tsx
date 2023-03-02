import { useEffect, useRef } from 'react';
import { widgetReferenceCount } from './reference_count';

export const useReferenceCount = (datasheetId: string | undefined, viewId: string | undefined) => {
  const preDatasheetId = useRef<string>();
  const preViewId = useRef<string>();
  useEffect(() => {
    if (!datasheetId || !viewId) {
      return;
    }
    const pDatasheetId = preDatasheetId.current;
    const pViewId = preViewId.current;
    // If the datasheetId or viewId is changed, the previous reference count is removed.
    if (datasheetId !== pDatasheetId || viewId !== pViewId) {
      widgetReferenceCount.remove(datasheetId, viewId);
      preDatasheetId.current = datasheetId;
      preViewId.current = viewId;
    }
    widgetReferenceCount.add(datasheetId, viewId);
    return () => widgetReferenceCount.remove(datasheetId, viewId);
  }, [datasheetId, viewId]);
};