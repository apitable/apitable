import { Button, LinkButton, useThemeColors } from '@apitable/components';
import { ICascaderField, IField, IReduxState, Selectors, StoreActions, Strings, t } from '@apitable/core';
import { SettingFilled } from '@apitable/icons';
import { useMount } from 'ahooks';
import { Switch } from 'antd';
import classNames from 'classnames';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CascaderDatasourceDatasheetSelect } from './cascader_datasource_datasheet_select';
import { CascaderDatasourceViewSelect } from './cascader_datasource_view_select';
import { CascaderRulesModal } from './cascader_rules_modal/cascader_rules_modal';

import commonStyles from '../styles.module.less';
import styles from './styles.module.less';

export interface IFormatCascaderProps {
  currentField: ICascaderField;
  setCurrentField: React.Dispatch<React.SetStateAction<IField>>;
}

export const FormatCascader = ({ currentField, setCurrentField }: IFormatCascaderProps): JSX.Element => {
  const dispatch = useDispatch();

  const linkedDatasheetLoading = useSelector((state: IReduxState) => Selectors.getDatasheetLoading(state, currentField.property.linkedDatasheetId));

  const [rulesModalVisible, setRulesModalVisible] = useState(false);

  const colors = useThemeColors();

  const onSwitchShowLastField = () => {
    setCurrentField({
      ...currentField,
      property: {
        ...currentField.property,
        showLasted: !currentField.property.showLasted,
      },
    });
  };

  useMount(() => {
    const linkedDatasheetId = currentField.property.linkedDatasheetId;
    if (!linkedDatasheetId) return;

    dispatch(StoreActions.fetchDatasheet(linkedDatasheetId) as any);
  });

  return (
    <div className={commonStyles.section} style={{ marginBottom: 8 }}>
      <section className={commonStyles.section}>
        <div className={classNames(commonStyles.sectionTitle, styles.sectionTitleWithTip)}>
          <span>{`1 ${t(Strings.cascader_datasource)}`}</span>
          <LinkButton color={colors.thirdLevelText} href="" className={styles.tip}>
            {t(Strings.cascader_how_to_label)}
          </LinkButton>
        </div>
        <div className={styles.datasourceSelectRow}>
          <CascaderDatasourceDatasheetSelect
            currentField={currentField}
            linkedDatasheetLoading={linkedDatasheetLoading === undefined || linkedDatasheetLoading}
            setCurrentField={setCurrentField}
          />
          <CascaderDatasourceViewSelect
            currentField={currentField}
            linkedDatasheetLoading={linkedDatasheetLoading === undefined || linkedDatasheetLoading}
            setCurrentField={setCurrentField}
          />
        </div>
      </section>
      <section className={commonStyles.section}>
        <div className={commonStyles.sectionTitle}>
          <span>{`2 ${t(Strings.cascader_rules)}`}</span>
        </div>
        <div>
          <Button
            className={styles.rulesButton}
            disabled={
              !currentField.property.linkedDatasheetId ||
              !currentField.property.linkedViewId ||
              linkedDatasheetLoading === undefined ||
              linkedDatasheetLoading
            }
            onClick={() => setRulesModalVisible(true)}
            prefixIcon={<SettingFilled />}
            variant="fill"
          >
            <span className={styles.rulesButtonText}>{t(Strings.config)}</span>
          </Button>
        </div>
      </section>
      {currentField.property.linkedDatasheetId && currentField.property.linkedViewId && currentField.property.linkedFields?.length > 0 && (
        <section className={commonStyles.section} style={{ marginBottom: 0 }}>
          <div className={classNames(commonStyles.sectionTitle, commonStyles.sub)} style={{ marginBottom: 0 }}>
            <Switch checked={currentField.property.showLasted} onChange={onSwitchShowLastField} size="small" style={{ marginRight: 8 }} />
            {t(Strings.cascader_show_lasted)}
          </div>
        </section>
      )}
      <CascaderRulesModal
        visible={rulesModalVisible}
        setVisible={setRulesModalVisible}
        currentField={currentField}
        setCurrentField={setCurrentField}
      />
    </div>
  );
};