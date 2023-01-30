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

import { IMeta, WidgetApi } from '@apitable/core';
import { FormPreviewer, WidgetPreview } from 'pc/components/datasheet_search_panel/components';
import { INodeInstalledWidget } from './interface';
import { useEffect, useState } from 'react';
import * as React from 'react';

interface ISubColumnProps {
  currentMeta: IMeta | null;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  showSubColumnWithWidget: boolean;
  currentViewId: string;
  currentDatasheetId: string;
  onChange(result: { datasheetId?: string; mirrorId?: string; viewId?: string; widgetIds?: string[] });
}

export const SubColumn: React.FC<ISubColumnProps> = props => {
  const { currentMeta, setLoading, showSubColumnWithWidget, currentViewId, currentDatasheetId, onChange } = props;
  const [installedWidgets, setInstalledWidgets] = useState<INodeInstalledWidget[] | null>(null);

  useEffect(() => {
    setInstalledWidgets(null);
    searchDatasheetInstalledWidget(currentDatasheetId);
    // eslint-disable-next-line
  }, [currentDatasheetId]);

  const searchDatasheetInstalledWidget = (datasheetId: string) => {
    if (!showSubColumnWithWidget) {
      return;
    }
    if (!datasheetId) {
      return;
    }
    setLoading(true);
    WidgetApi.getWidgetsInfoByNodeId(datasheetId).then(res => {
      const { data, success } = res.data;
      if (success) {
        setLoading(false);
        setInstalledWidgets(data);
      }
    });
  };

  const viewDataLoaded = Boolean(currentMeta && currentViewId);

  return (
    <>
      {viewDataLoaded && <FormPreviewer datasheetId={currentDatasheetId} viewId={currentViewId} meta={currentMeta!} onChange={onChange} />}
      {installedWidgets && <WidgetPreview onChange={onChange} installedWidgets={installedWidgets} />}
    </>
  );
};
