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

import * as React from 'react';
import { useEffect, useState } from 'react';
import { IMeta, WidgetApi } from '@apitable/core';
import { FormPreviewer } from 'pc/components/datasheet_search_panel/components/form_previewer';
import { WidgetPreview } from 'pc/components/datasheet_search_panel/components/widget_preview';
import { INodeInstalledWidget, SecondConfirmType } from './interface';

interface IPriviewColumnProps {
  currentMeta: IMeta | null;
  setLoading: React.Dispatch<boolean>;
  currentViewId: string;
  currentDatasheetId: string;
  secondConfirmType?: SecondConfirmType;

  onChange(result: { datasheetId?: string; mirrorId?: string; viewId?: string; widgetIds?: string[] }): void;
}

export const PreviewColumn: React.FC<React.PropsWithChildren<IPriviewColumnProps>> = (props) => {
  const { currentMeta, setLoading, currentViewId, currentDatasheetId, onChange, secondConfirmType } = props;
  const [installedWidgets, setInstalledWidgets] = useState<INodeInstalledWidget[] | null>(null);

  useEffect(() => {
    setInstalledWidgets(null);
    searchDatasheetInstalledWidget(currentDatasheetId);
    // eslint-disable-next-line
  }, [currentDatasheetId]);

  const showSubColumnWithWidget = secondConfirmType === SecondConfirmType.Widget;
  const searchDatasheetInstalledWidget = (datasheetId: string) => {
    if (!showSubColumnWithWidget) {
      return;
    }
    if (!datasheetId) {
      return;
    }
    setLoading(true);
    WidgetApi.getWidgetsInfoByNodeId(datasheetId).then((res) => {
      const { data, success } = res.data;
      if (success) {
        setLoading(false);
        setInstalledWidgets(data);
      }
    });
  };

  const showViewPreview = Boolean(currentMeta && currentViewId && secondConfirmType === SecondConfirmType.Form);

  return (
    <>
      {showViewPreview && <FormPreviewer datasheetId={currentDatasheetId} viewId={currentViewId} meta={currentMeta!} onChange={onChange} />}
      {installedWidgets && <WidgetPreview onChange={onChange} installedWidgets={installedWidgets} />}
    </>
  );
};
