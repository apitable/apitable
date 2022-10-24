import { BasicValueType, Field, IField, isSelectField, Selectors, Strings, t } from '@apitable/core';
import classNames from 'classnames';
import { useThemeColors } from '@vikadata/components';
import * as React from 'react';
import { useSelector } from 'react-redux';
import CheckedIcon from 'static/icon/datasheet/column/datasheet_icon_checkbox.svg';
import CheckIcon from 'static/icon/datasheet/datasheet_icon_checkbox_normal.svg';
import IconArrowGray from 'static/icon/datasheet/datasheet_icon_toward_right_gray.svg';
import styles from './style.module.less';
import { Tooltip } from 'pc/components/common/tooltip';

interface IViewRules {
  index: number;
  onChange: (type: boolean) => void;
  rulesItem: { fieldId: string; desc: boolean };
  invalid?: boolean;
  invalidTip?: string;
}

export const ViewRules: React.FC<IViewRules> = props => {
  const colors = useThemeColors();
  const { onChange, rulesItem, invalid, invalidTip } = props;
  const fieldMap = useSelector(state => Selectors.getFieldMap(state, state.pageParams.datasheetId!))!;
  const field = fieldMap[rulesItem.fieldId];
  if (!field) {
    return <></>;
  }
  const ascClass = classNames(styles.asc, !rulesItem.desc ? styles.active : '');
  const descClass = classNames(styles.desc, rulesItem.desc ? styles.active : '');
  // 根据active返回合适的icon
  function renderCorrectIcon(className: string) {
    if (/active/.test(className)) {
      return <IconArrowGray fill={colors.staticWhite0} />;
    }
    return <IconArrowGray fill={colors.thirdLevelText} />;

  }
  function changeDescType(e: React.MouseEvent, type: boolean) {
    onChange(type);
  }

  // 数字排序
  function sortTypeForNumber() {
    return (
      <>
        <div className={ascClass} onClick={e => { changeDescType(e, false); }}>
          1
          <div className={styles.iconArrow}>
            {renderCorrectIcon(ascClass)}
          </div>
          9
        </div>
        <div className={descClass} onClick={e => { changeDescType(e, true); }}>
          9
          <div className={styles.iconArrow}>
            {renderCorrectIcon(descClass)}
          </div>
          1
        </div>
      </>
    );
  }

  // 勾选排序
  function sortTypeForCheckbox() {
    const ascIconColor = !rulesItem.desc ? colors.staticWhite0 : colors.thirdLevelText;
    const descIconColor = rulesItem.desc ? colors.staticWhite0 : colors.thirdLevelText;
    return (
      <>
        <div className={ascClass} onClick={e => { changeDescType(e, false); }}>
          <CheckIcon width={15} height={15} fill={ascIconColor} />
          <div className={styles.iconArrow}>
            {renderCorrectIcon(ascClass)}
          </div>
          <CheckedIcon width={15} height={15} fill={ascIconColor} />
        </div>
        <div className={descClass} onClick={e => { changeDescType(e, true); }}>
          <CheckedIcon width={15} height={15} fill={descIconColor} />
          <div className={styles.iconArrow}>
            {renderCorrectIcon(descClass)}
          </div>
          <CheckIcon width={15} height={15} fill={descIconColor} />
        </div>
      </>
    );
  }

  // 字母排序
  function sortTypeForLetter() {
    return (
      <>
        <div className={ascClass} onClick={e => { changeDescType(e, false); }}>
          A
          <div className={styles.iconArrow}>
            {renderCorrectIcon(ascClass)}
          </div>
          Z
        </div>

        <div className={descClass} onClick={e => { changeDescType(e, true); }}>
          Z
          <div className={styles.iconArrow}>
            {renderCorrectIcon(descClass)}
          </div>
          A
        </div>
      </>
    );
  }

  // 顺序排序
  function sortTypeForSequence() {
    return (
      <>
        <div className={ascClass} onClick={e => { changeDescType(e, false); }}>
          {t(Strings.desc_sort)}
        </div>
        <div className={descClass} onClick={e => { changeDescType(e, true); }}>
          {t(Strings.asc_sort)}
        </div>
      </>
    );
  }

  function judgeFieldRule(field: IField) {
    const { valueType } = Field.bindModel(field);

    // 单多选顺序排序，其它的按照返回类型展示。lookup 实体字段为单多选时按 string 处理
    if (isSelectField(field)) {
      return sortTypeForSequence();
    }
    switch (valueType) {
      case BasicValueType.String:
        return sortTypeForLetter();
      case BasicValueType.Number:
      case BasicValueType.DateTime:
        return sortTypeForNumber();
      case BasicValueType.Boolean:
        return sortTypeForCheckbox();
      default:
        return sortTypeForLetter();
    }
  }

  return invalid ? (
    <Tooltip title={invalidTip}>
      <div className={styles.rules}>
        {judgeFieldRule(field)}
      </div>
    </Tooltip>
  ) : (
    <div className={styles.rules}>
      {judgeFieldRule(field)}
    </div>
  );
};
