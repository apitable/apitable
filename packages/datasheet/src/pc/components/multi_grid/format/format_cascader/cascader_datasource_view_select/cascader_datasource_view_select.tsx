// eslint-disable-next-line no-restricted-imports
import { IOption, Select, useThemeColors } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { GridOutlined } from '@apitable/icons';
import { IFormatCascaderProps } from '../format_cascader_select';
import styles from './styles.module.less';

export const CascaderDatasourceViewSelect = ({
  currentField,
  setCurrentField,
  linkedDatasheetLoading,
  linkedDatasheet,
}: IFormatCascaderProps & { linkedDatasheetLoading: boolean }): JSX.Element => {
  const propLinkedDatasheetId = currentField.property.linkedDatasheetId || undefined;
  const propLinkedViewId = currentField.property.linkedViewId || undefined;

  const colors = useThemeColors();

  const onSelectDatasourceView = (option: IOption) => {
    setCurrentField({
      ...currentField,
      property: {
        ...currentField?.property,
        linkedViewId: option.value as string,
        // toggle view should clear cache fields
        linkedFields: [],
        fullLinkedFields: [],
      },
    });
  };

  return (
    <Select
      disabled={linkedDatasheetLoading || !propLinkedDatasheetId}
      onSelected={onSelectDatasourceView}
      openSearch
      searchPlaceholder={t(Strings.search)}
      options={
        linkedDatasheet?.snapshot.meta.views.map((view) => ({
          value: view.id,
          label: view.name,
          prefixIcon: <GridOutlined color={colors.fc3} />,
        })) || []
      }
      placeholder={t(Strings.cascader_select_view)}
      prefixIcon={propLinkedViewId && <GridOutlined color={colors.fc3} />}
      triggerCls={styles.viewSelect}
      value={propLinkedViewId}
    />
  );
};
