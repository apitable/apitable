import { useState } from 'react';
import { Box, Button } from '@apitable/components';
import { ConfigConstant, INode, IPermissions, Strings, t } from '@apitable/core';
import { Loading } from 'pc/components/common';
import { LoaderContext } from 'pc/components/data_source_selector/context/loader_context';
import { nodeStatusLoader } from 'pc/components/data_source_selector/loaders/node_status_loader';
import { nodeTypeFilterLoader } from 'pc/components/data_source_selector/loaders/node_type_filter_loader';
import { nodeVisibleFilterLoader } from 'pc/components/data_source_selector/loaders/node_visible_filter_loader';
import { useFetchExtraData } from 'pc/components/data_source_selector_enhanced/data_source_selector_for_node/hooks/use_fetch_extra_data';
import { useResponsive } from '../../../hooks';
import { ScreenSize } from '../../common/component_display';
import { DataSourceSelectorBase } from '../../data_source_selector/data_source_selector';
import { DataSourceSelectorWrapper } from '../../data_source_selector/data_source_selector_wrapper';
import { IOnChange, IOnChangeParams, ISearchPanelProps } from '../../data_source_selector/interface';
import styles from './style.module.less';

interface IDataSourceSelectorForAIProps {
  onChange: IOnChange<IOnChangeParams>;
  defaultNodeIds: ISearchPanelProps['defaultNodeIds'];
  nodeTypes: ConfigConstant.NodeType[];
  permissionRequired?: keyof IPermissions;
  requiredData?: (keyof IOnChangeParams)[];

  footer?: React.ReactNode;
  onHide(): void;
}

export const DataSourceSelectorForNode: React.FC<IDataSourceSelectorForAIProps> = ({
  onChange,
  nodeTypes,
  onHide,
  footer,
  defaultNodeIds,
  permissionRequired = 'editable',
  requiredData = ['datasheetId'],
}) => {
  const [result, setResult] = useState<IOnChangeParams>();
  const { fetchExtraData, isLoadingExtraData } = useFetchExtraData();

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const isPc = !isMobile;

  const _onChange = (result: IOnChangeParams) => {
    setResult(result);
  };

  const onSubmit = async () => {
    if (result?.datasheetId || result?.mirrorId) {
      await fetchExtraData({
        datasheetId: result?.datasheetId,
        mirrorId: result?.mirrorId,
      });
    }
    onChange(result || {});
  };

  let title = nodeTypes.includes(ConfigConstant.NodeType.FORM) ? t(Strings.check_link_form) : t(Strings.check_link_table);
  if (nodeTypes.includes(ConfigConstant.NodeType.AUTOMATION)) {
    title = t(Strings.check_link_automation);
  }

  const disabled = result == null || Object.keys(result).length === 0;

  return (
    <LoaderContext.Provider
      value={{
        nodeTypeFilterLoader: (nodes) => {
          return nodes.filter((node) => {
            return nodeTypeFilterLoader(node, nodeTypes);
          });
        },
        nodeVisibleFilterLoader: (nodes) => {
          return nodes.filter((node) => {
            return nodeVisibleFilterLoader(node, permissionRequired);
          });
        },
        nodeStatusLoader: (node: INode) => {
          return nodeStatusLoader(node, permissionRequired);
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
                  // eslint-disable-next-line indent
                    title: title,
                  // eslint-disable-next-line indent
                    onHide,
                }
                : undefined
            }
            requiredData={requiredData}
          />
          <>
            {
              footer ? (
                <>
                  <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                    {footer}

                    <div className={styles.chatbotCreateButtonGroupFooter}>
                      <Button color={'default'} onClick={onHide}>
                        {t(Strings.cancel)}
                      </Button>
                      <Button color={'primary'} disabled={disabled} onClick={onSubmit}>
                        {t(Strings.submit)}
                      </Button>
                    </div>
                  </Box>
                </>

              ): (
                <div className={styles.chatbotCreateButtonGroup}>
                  <Button color={'default'} onClick={onHide}>
                    {t(Strings.cancel)}
                  </Button>
                  <Button color={'primary'} disabled={disabled} onClick={onSubmit}>
                    {t(Strings.submit)}
                  </Button>
                </div>
              )
            }
          </>
          {isLoadingExtraData && (
            <Loading className={'vk-absolute vk-top-0 vk-left-0 vk-right-0 vk-bottom-0 vk-bg-transparent vk-backdrop-blur-[1px]'} />
          )}
        </div>
      </DataSourceSelectorWrapper>
    </LoaderContext.Provider>
  );
};
