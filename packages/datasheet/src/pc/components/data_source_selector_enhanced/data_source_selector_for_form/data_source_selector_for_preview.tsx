import { useState } from 'react';
import { ConfigConstant, INode, Strings, t } from '@apitable/core';
import { LoaderContext } from 'pc/components/data_source_selector/context/loader_context';
import { nodeStatusLoader } from 'pc/components/data_source_selector/loaders/node_status_loader';
import { nodeTypeFilterLoader } from 'pc/components/data_source_selector/loaders/node_type_filter_loader';
import { nodeVisibleFilterLoader } from 'pc/components/data_source_selector/loaders/node_visible_filter_loader';
import { useResponsive } from '../../../hooks';
import { ScreenSize } from '../../common/component_display';
import { DataSourceSelectorBase } from '../../data_source_selector/data_source_selector';
import { DataSourceSelectorWrapper } from '../../data_source_selector/data_source_selector_wrapper';
import { IOnChange, IOnChangeParams, ISearchPanelProps } from '../../data_source_selector/interface';
import { FormPreviewer } from './form_previewer/form_previewer';
import styles from './style.module.less';

interface IDataSourceSelectorForAIProps {
  onChange: IOnChange<IOnChangeParams>;
  defaultNodeIds: ISearchPanelProps['defaultNodeIds'];
  nodeTypes?: ConfigConstant.NodeType[];

  onHide(): void;
}

export const DataSourceSelectorForForm: React.FC<IDataSourceSelectorForAIProps> = ({
  nodeTypes = [ConfigConstant.NodeType.DATASHEET],
  onChange,
  onHide,
  defaultNodeIds,
}) => {
  const [result, setResult] = useState<IOnChangeParams>();

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const isPc = !isMobile;

  const _onChange = (result: IOnChangeParams) => {
    setResult(result);
  };

  const title = t(Strings.check_link_table);

  return (
    <LoaderContext.Provider
      value={{
        nodeVisibleFilterLoader: (nodes) => {
          return nodes.filter((node) => {
            return nodeVisibleFilterLoader(node, 'editable');
          });
        },
        nodeStatusLoader: (node: INode) => {
          return nodeStatusLoader(node, 'editable');
        },
        nodeTypeFilterLoader: (nodes) => {
          return nodes.filter((node) => {
            return nodeTypeFilterLoader(node, nodeTypes);
          });
        },
      }}
    >
      <DataSourceSelectorWrapper hide={onHide} title={title}>
        <div className={styles.container}>
          <DataSourceSelectorBase
            onChange={_onChange}
            defaultNodeIds={defaultNodeIds}
            headerConfig={
              isPc
                ? {
                  title: title,
                  onHide: onHide,
                }
                : undefined
            }
            requiredData={['datasheetId', 'viewId', 'meta']}
          />
          <FormPreviewer datasheetId={result?.datasheetId!} viewId={result?.viewId!} meta={result?.meta!} onChange={onChange} />
        </div>
      </DataSourceSelectorWrapper>
    </LoaderContext.Provider>
  );
};
