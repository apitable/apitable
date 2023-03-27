import { IOption, Select, useThemeColors } from '@apitable/components';
import { ConfigConstant, IReduxState, Selectors, Strings, t } from '@apitable/core';
import { ColumnFigureFilled } from '@apitable/icons';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Emoji } from 'pc/components/common/emoji';
import { ISearchChangeProps, SearchPanel } from 'pc/components/datasheet_search_panel';
import { IFormatCascaderProps } from '../format_cascader_select';
import styles from './styles.module.less';

export const CascaderDatasourceDatasheetSelect = ({
  currentField,
  setCurrentField,
  linkedDatasheetLoading,
}: IFormatCascaderProps & { linkedDatasheetLoading: boolean }): JSX.Element => {
  const propLinkedDatasheetId = currentField.property.linkedDatasheetId || undefined;

  const colors = useThemeColors();

  const [searchPanelVisible, setSearchPanelVisible] = useState(false);

  const linkedDatasheet = useSelector((state: IReduxState) => (propLinkedDatasheetId ? Selectors.getDatasheet(state, propLinkedDatasheetId) : null));
  const datasheetParentId = useSelector((state: IReduxState) => Selectors.getDatasheet(state)?.parentId) || '';

  const onSelectDatasource = ({ datasheetId }: ISearchChangeProps) => {
    if (!datasheetId) return;

    setSearchPanelVisible(false);
    setCurrentField({
      ...currentField,
      property: {
        ...currentField?.property,
        linkedDatasheetId: datasheetId,
        linkedViewId: '',
      },
    });
  };

  const onOpenDatasource = () => {
    setSearchPanelVisible(true);
  };

  const renderPrefixIcon = () => {
    if (!linkedDatasheet) return null;

    return linkedDatasheet?.icon ? (
      <Emoji emoji={linkedDatasheet.icon} set="apple" size={ConfigConstant.CELL_EMOJI_SIZE} />
    ) : (
      <ColumnFigureFilled color={colors.fc3} />
    );
  };

  return (
    <>
      <div onClick={onOpenDatasource} className={styles.datasourceSelect}>
        <Select
          disabled={linkedDatasheetLoading}
          listCls={styles.datasourceDropdownList}
          openSearch={searchPanelVisible}
          options={linkedDatasheet ? [{ value: linkedDatasheet.id, label: linkedDatasheet.name }] : []}
          placeholder={t(Strings.cascader_datasource_placeholder)}
          prefixIcon={renderPrefixIcon()}
          renderValue={(option: IOption) => option.label}
          triggerCls={styles.viewSelectInner}
          value={linkedDatasheet?.id}
        />
      </div>
      {searchPanelVisible && (
        <SearchPanel
          folderId={linkedDatasheet ? linkedDatasheet.parentId : datasheetParentId}
          activeDatasheetId=""
          setSearchPanelVisible={setSearchPanelVisible}
          onChange={onSelectDatasource}
        />
      )}
    </>
  );
};