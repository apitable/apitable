/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCounter } from 'ahooks';
import { loadWidget, WidgetLoadError } from '../../initialize_widget';

export function useWidgetComponent(
  codeUrl?: string, widgetPackageId?: string):
  [React.FC<React.PropsWithChildren<unknown>> | undefined, () => void, boolean, WidgetLoadError | undefined] {
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
