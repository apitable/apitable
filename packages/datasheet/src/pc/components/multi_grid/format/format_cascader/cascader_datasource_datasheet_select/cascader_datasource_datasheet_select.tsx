import classNames from 'classnames';
import { useState } from 'react';
import * as React from 'react';
import { useThemeColors } from '@apitable/components';
import { IReduxState, Selectors, Strings, t } from '@apitable/core';
import { ChevronRightOutlined } from '@apitable/icons';
import { NodeIcon } from 'pc/components/catalog/tree/node_icon';
import { ISearchChangeProps, SearchPanel } from 'pc/components/datasheet_search_panel';
import { useAppSelector } from 'pc/store/react-redux';
import settingStyles from '../../../field_setting/styles.module.less';
import { IFormatCascaderProps } from '../format_cascader_select';
import styles from './styles.module.less';

export const CascaderDatasourceDatasheetSelect = ({ currentField, setCurrentField, linkedDatasheet }: IFormatCascaderProps): JSX.Element => {
  const colors = useThemeColors();

  const [searchPanelVisible, setSearchPanelVisible] = useState(false);

  const datasheetParentId = useAppSelector((state: IReduxState) => Selectors.getDatasheet(state)?.parentId) || '';

  const onSelectDatasource = ({ datasheetId }: ISearchChangeProps) => {
    const isDstChange = datasheetId !== currentField.property.linkedDatasheetId;
    if (!datasheetId || !isDstChange) return;

    setSearchPanelVisible(false);
    setCurrentField({
      ...currentField,
      property: {
        ...currentField?.property,
        linkedDatasheetId: datasheetId,
        linkedViewId: '',
        // toggle datasheet should clear cache fields
        linkedFields: [],
        fullLinkedFields: [],
      },
    });
  };

  const onOpenDatasource = () => {
    setSearchPanelVisible(true);
  };

  return (
    <>
      <div onClick={onOpenDatasource} className={classNames(styles.datasourceSelect, settingStyles.section)}>
        <div className={settingStyles.sectionInfo}>
          <div className={settingStyles.iconType}>
            <NodeIcon nodeId="foreignDatasheetIcon" icon={linkedDatasheet?.icon} editable={false} size={16} />
          </div>
          <div className={settingStyles.text}>
            {linkedDatasheet?.name || <div className={styles.placeholder}>{t(Strings.cascader_datasource_placeholder)}</div>}
          </div>
          <div className={settingStyles.arrow}>
            <ChevronRightOutlined size={16} color={colors.thirdLevelText} />
          </div>
        </div>
      </div>
      {searchPanelVisible && (
        <SearchPanel
          folderId={linkedDatasheet ? linkedDatasheet.parentId : datasheetParentId}
          activeDatasheetId={linkedDatasheet ? linkedDatasheet.id : ''}
          setSearchPanelVisible={setSearchPanelVisible}
          onChange={onSelectDatasource}
        />
      )}
    </>
  );
};
