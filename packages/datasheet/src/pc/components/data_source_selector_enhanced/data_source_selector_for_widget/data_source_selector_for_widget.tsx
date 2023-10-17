import { DataSourceSelectorWrapper } from '../../data_source_selector/data_source_selector_wrapper';
import { DataSourceSelectorBase } from '../../data_source_selector/data_source_selector';
import styles from './style.module.less';
import { Strings, t } from '@apitable/core';
import { useState } from 'react';
import { IOnChange, IOnChangeParams, ISearchPanelProps } from '../../data_source_selector/interface';
import { useResponsive } from '../../../hooks';
import { ScreenSize } from '../../common/component_display';
import { WidgetPreview } from './widget_preview/widget_preview';

interface IDataSourceSelectorForAIProps {
  onChange: IOnChange<IOnChangeParams>;
  defaultNodeIds: ISearchPanelProps['defaultNodeIds']

  onHide(): void;
}

export const DataSourceSelectorForWidget: React.FC<IDataSourceSelectorForAIProps> = ({ onChange, onHide, defaultNodeIds }) => {
  const [result, setResult] = useState<IOnChangeParams>();

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const isPc = !isMobile;

  const _onChange = (result: IOnChangeParams) => {
    setResult(result);
  };

  const title = t(Strings.check_link_table);

  return <DataSourceSelectorWrapper
    hide={onHide}
    title={title}
  >
    <div className={styles.container}>
      <DataSourceSelectorBase
        onChange={_onChange}
        defaultNodeIds={defaultNodeIds}
        headerConfig={isPc ? {
          title: title,
          onHide
        } : undefined}
        requiredData={['datasheetId']}
      />
      {
        result && <WidgetPreview onChange={onChange} datasheetId={result.datasheetId!}/>
      }

    </div>
  </DataSourceSelectorWrapper>;
};
