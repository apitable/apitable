import { IMeta, WidgetApi } from '@vikadata/core';
import { FormPreviewer, WidgetPreview } from 'pc/components/datasheet_search_panel/components';
import { INodeInstalledWidget } from 'pc/components/datasheet_search_panel/datasheet_search_panel';
import { useEffect, useState } from 'react';
import * as React from 'react';

interface ISubColumnProps {
  currentMeta: IMeta | null,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  showSubColumnWithWidget: boolean,
  currentViewId: string,
  currentDatasheetId: string,
  onChange(result: {
    datasheetId?: string;
    mirrorId?: string;
    viewId?: string;
    widgetIds?: string[];
  });
}

export const SubColumn: React.FC<ISubColumnProps> = (props) => {
  const { currentMeta, setLoading, showSubColumnWithWidget, currentViewId, currentDatasheetId, onChange } = props;
  const [installedWidgets, setInstalledWidgets] = useState<INodeInstalledWidget[] | null>(null);

  useEffect(() => {
    setInstalledWidgets(null);
    searchDatasheetInstalledWidget(currentDatasheetId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  return <>
    {
      viewDataLoaded &&
      <FormPreviewer
        datasheetId={currentDatasheetId}
        viewId={currentViewId}
        meta={currentMeta!}
        onChange={onChange}
      />
    }
    {
      installedWidgets &&
      <WidgetPreview
        onChange={onChange}
        installedWidgets={installedWidgets}
      />
    }
  </>;
};
