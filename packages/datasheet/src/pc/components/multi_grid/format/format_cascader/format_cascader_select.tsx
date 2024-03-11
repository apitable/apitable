import { useMount } from 'ahooks';
import classNames from 'classnames';
import { useState } from 'react';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Button, LinkButton, useThemeColors, Typography, Switch } from '@apitable/components';
import { ICascaderField, IDatasheetState, IField, IReduxState, Selectors, StoreActions, Strings, t } from '@apitable/core';
import { SettingOutlined } from '@apitable/icons';
import { useAppSelector } from 'pc/store/react-redux';
import { IFieldCascaderErrors } from '../../field_setting/check_factory';
import commonStyles from '../styles.module.less';
import { CascaderDatasourceDatasheetSelect } from './cascader_datasource_datasheet_select';
import { CascaderDatasourceViewSelect } from './cascader_datasource_view_select';
import { CascaderRulesModal } from './cascader_rules_modal/cascader_rules_modal';
import styles from './styles.module.less';

export interface IFormatCascaderProps {
  currentField: ICascaderField;
  setCurrentField: React.Dispatch<React.SetStateAction<IField>>;
  optionErrMsg?: IFieldCascaderErrors;
  linkedDatasheet?: IDatasheetState | null;
}

export const FormatCascader = ({ currentField, setCurrentField, optionErrMsg }: IFormatCascaderProps): JSX.Element => {
  const { linkedFields, linkedDatasheetId, linkedViewId, showAll } = currentField.property;

  const dispatch = useDispatch();

  const linkedDatasheetLoading = useAppSelector((state: IReduxState) => Selectors.getDatasheetLoading(state, linkedDatasheetId));
  const activeNodePrivate = useAppSelector(Selectors.getActiveNodePrivate);
  const linkedDatasheet = useAppSelector((state: IReduxState) => {
    const _linkedDatasheetId = Selectors.getDatasheet(state, linkedDatasheetId);
    if (!activeNodePrivate && _linkedDatasheetId?.nodePrivate) return null;
    return linkedDatasheetId ? _linkedDatasheetId : null;
  });

  const [rulesModalVisible, setRulesModalVisible] = useState(false);

  const colors = useThemeColors();

  const onSwitchShowLastField = () => {
    setCurrentField({
      ...currentField,
      property: {
        ...currentField.property,
        showAll: !showAll,
      },
    });
  };

  useMount(() => {
    if (!linkedDatasheetId) return;

    dispatch(StoreActions.fetchDatasheet(linkedDatasheetId) as any);
  });

  const ruleBtnDisabled = !linkedDatasheetId || !linkedViewId || linkedDatasheetLoading === undefined
    || linkedDatasheetLoading || !linkedDatasheet;

  return (
    <div className={commonStyles.section} style={{ marginBottom: 8 }}>
      <section className={commonStyles.section}>
        <div className={classNames(commonStyles.sectionTitle, styles.sectionTitleWithTip)}>
          <span>{`1.${t(Strings.cascader_datasource)}`}</span>
          <LinkButton target="_blank" color={colors.thirdLevelText} href={t(Strings.field_help_cascader)} className={styles.tip}>
            {t(Strings.cascader_how_to_label)}
          </LinkButton>
        </div>
        <div className={styles.datasourceSelectRow}>
          <CascaderDatasourceDatasheetSelect currentField={currentField} setCurrentField={setCurrentField} linkedDatasheet={linkedDatasheet} />
          {optionErrMsg?.errors?.linkedDatasheetId && <section className={styles.error}>{optionErrMsg?.errors?.linkedDatasheetId}</section>}
        </div>
        <div className={commonStyles.section}>
          <div className={commonStyles.sectionTitle}>2.{t(Strings.cascader_select_view)}</div>
          <CascaderDatasourceViewSelect
            currentField={currentField}
            linkedDatasheetLoading={linkedDatasheetLoading === undefined || linkedDatasheetLoading}
            setCurrentField={setCurrentField}
            linkedDatasheet={linkedDatasheet}
          />
          {optionErrMsg?.errors?.linkedViewId && <section className={styles.error}>{optionErrMsg?.errors?.linkedViewId}</section>}
        </div>
        <div className={commonStyles.sectionTitle}>
          <span>{`3.${t(Strings.cascader_rules)}`}</span>
        </div>
        <div>
          {linkedFields?.length > 0 ? (
            <div className={styles.cascaderRulesShow}>
              <Typography variant="body3" className={styles.rulesText} ellipsis>
                {linkedFields.map((lf) => lf.name).join('/')}
              </Typography>
              <LinkButton
                className={styles.rulesButton}
                disabled={ruleBtnDisabled}
                onClick={() => {
                  if (!ruleBtnDisabled) {
                    setRulesModalVisible(true);
                  }
                }}
                underline={false}
              >
                <span className={styles.rulesButtonText}>{t(Strings.config)}</span>
              </LinkButton>
            </div>
          ) : (
            <>
              <Button
                className={styles.rulesButton}
                disabled={ruleBtnDisabled}
                onClick={() => setRulesModalVisible(true)}
                prefixIcon={<SettingOutlined />}
                variant="fill"
              >
                <span className={styles.rulesButtonText}>{t(Strings.config)}</span>
              </Button>
              {optionErrMsg?.errors?.linkedFields && <section className={styles.error}>{optionErrMsg?.errors?.linkedFields}</section>}
            </>
          )}
        </div>
      </section>
      {linkedDatasheetId && linkedViewId && linkedFields?.length > 0 && (
        <section className={commonStyles.section} style={{ marginBottom: 0 }}>
          <div className={classNames(commonStyles.sectionTitle, commonStyles.sub)} style={{ marginBottom: 0 }}>
            <Switch checked={showAll} onChange={onSwitchShowLastField} size="small" style={{ marginRight: 8 }} />
            {t(Strings.cascader_show_all)}
          </div>
        </section>
      )}
      {rulesModalVisible && (
        <CascaderRulesModal
          visible={rulesModalVisible}
          setVisible={setRulesModalVisible}
          currentField={currentField}
          setCurrentField={setCurrentField}
        />
      )}
    </div>
  );
};
