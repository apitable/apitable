import { useThemeColors } from '@apitable/components';
import { IReduxState, Selectors, Strings, t } from '@apitable/core';
import { ChevronRightOutlined } from '@apitable/icons';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ISearchChangeProps, SearchPanel } from 'pc/components/datasheet_search_panel';
import { IFormatCascaderProps } from '../format_cascader_select';
import styles from './styles.module.less';
import settingStyles from '../../../field_setting/styles.module.less';
import * as React from 'react';
import classNames from 'classnames';
import { NodeIcon } from 'pc/components/catalog/tree/node_icon';

export const CascaderDatasourceDatasheetSelect = ({
  currentField,
  setCurrentField,
}: IFormatCascaderProps): JSX.Element => {
  const propLinkedDatasheetId = currentField.property.linkedDatasheetId || undefined;

  const colors = useThemeColors();

  const [searchPanelVisible, setSearchPanelVisible] = useState(false);

  const linkedDatasheet = useSelector((state: IReduxState) => (propLinkedDatasheetId ? Selectors.getDatasheet(state, propLinkedDatasheetId) : null));
  const datasheetParentId = useSelector((state: IReduxState) => Selectors.getDatasheet(state)?.parentId) || '';

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
          <div className={settingStyles.text}>{linkedDatasheet?.name || t(Strings.cascader_datasource_placeholder)}</div>
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