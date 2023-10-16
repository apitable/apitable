import { ConfigConstant, IPermissions, Strings, t } from '@apitable/core';
import { LoaderContext } from 'pc/components/data_source_selector/context/loader_context';
import { useResponsive } from '../../../hooks';
import { ScreenSize } from '../../common/component_display';
import { DataSourceSelectorBase } from '../../data_source_selector/data_source_selector';
import { DataSourceSelectorWrapper } from '../../data_source_selector/data_source_selector_wrapper';
import { IOnChange, IOnChangeParams, ISearchPanelProps } from '../../data_source_selector/interface';
import styles from './style.module.less';
import { Button } from '@apitable/components';
import { useState } from 'react';

interface IDataSourceSelectorForAIProps {
  onChange: IOnChange<IOnChangeParams>;
  defaultNodeIds: ISearchPanelProps['defaultNodeIds'];
  nodeTypes: ConfigConstant.NodeType[];
  permissionRequired?: keyof IPermissions;
  requiredData?: (keyof IOnChangeParams)[];

  onHide(): void;
}

export const DataSourceSelectorForNode: React.FC<IDataSourceSelectorForAIProps> = ({
  onChange,
  nodeTypes,
  onHide,
  defaultNodeIds,
  permissionRequired = 'editable',
  requiredData = ['datasheetId'],
}) => {
  const [result, setResult] = useState<IOnChangeParams>();

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const isPc = !isMobile;

  const _onChange = (result: IOnChangeParams) => {
    setResult(result);
  };

  const title = nodeTypes.includes(ConfigConstant.NodeType.FORM) ? t(Strings.check_link_form) : t(Strings.check_link_table);

  return (
    <LoaderContext.Provider
      value={{
        nodeFilterLoader: (nodes) => {
          return nodes.filter((node) => {
            const _nodeTypes = [ConfigConstant.NodeType.FOLDER, ...nodeTypes];
            const allowNodeType = _nodeTypes.includes(node.type);
            const allowPermission = node['permissions'] ? Boolean(node['permissions'][permissionRequired]) : true;
            return allowNodeType && allowPermission;
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
                    onHide,
                  }
                : undefined
            }
            requiredData={requiredData}
          />
          <div className={styles.chatbotCreateButtonGroup}>
            <Button color={'default'} onClick={onHide}>
              {t(Strings.cancel)}
            </Button>
            <Button
              color={'primary'}
              disabled={!result}
              onClick={() => {
                onChange(result || {});
              }}
            >
              {t(Strings.submit)}
            </Button>
          </div>
        </div>
      </DataSourceSelectorWrapper>
    </LoaderContext.Provider>
  );
};
