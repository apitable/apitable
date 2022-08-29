import * as React from 'react';
import { Selectors, FieldType, IJOTAction, IDPrefix, IField, SegmentType, LINK_REG, string2Segment } from '@vikadata/core';
import styles from './style.module.less';
import { CellValue } from 'pc/components/multi_grid/cell/cell_value';
import { FieldTitle } from 'pc/components/expand_record/field_editor';
import ChangesetItemHeader from '../changeset_item_header';
import cls from 'classnames';
import { useThemeColors } from '@vikadata/components';
import { useStore } from 'react-redux';
import { supplyMemberField, supplyMultiSelectField, supplyExtraField, supplySelectField } from './utils';
import EditorTitleContext from '../../editor_title_context';
import { ArrowRightOutlined } from '@vikadata/icons';
import { has, intersectionWith, isEqual, xorBy } from 'lodash';
import { stopPropagation } from 'pc/utils';

const TEXT_TYPES = [
  FieldType.Text, FieldType.SingleText, FieldType.Number,
  FieldType.DateTime, FieldType.CreatedTime, FieldType.LastModifiedBy,
  FieldType.Email, FieldType.Currency, FieldType.URL, FieldType.Phone, FieldType.Percent
];

interface IChangesetItemAction {
  revision: number;
  actions: IJOTAction[];
  datasheetId: string;
  cacheFieldOptions: object;
}
interface IActionItem {
  action: IJOTAction;
  index: number;
}

const FieldSwitchTitle: React.FC<{ od: any; oi: any }> = ({ od, oi }) => {
  const colors = useThemeColors();
  return (
    <div className={styles.changesetAction}>
      <div className={styles.header}>
        {/* 复制列时 od 不存在，特殊处理 */}
        {od && <ChangesetItemHeader field={od} old />}
        {od && <ArrowRightOutlined size={16} color={colors.thirdLevelText} />}
        <ChangesetItemHeader field={oi} block={!od} />
      </div>
    </div>
  );
};

const ChangesetItemActionBase: React.FC<IChangesetItemAction> = (props) => {
  const { actions, datasheetId, cacheFieldOptions, revision } = props;
  const { updateFocusFieldId } = React.useContext(EditorTitleContext);
  const store = useStore();

  const state = store.getState();
  const snapshot = Selectors.getSnapshot(state, datasheetId)!;
  const ActionItem: React.FC<IActionItem> = ({ action, index }) => {
    let { od, oi } = action as any;
    const { p } = action as any;

    // 单元格操作
    if (p[0] === 'recordMap' && p.length === 4) {
      if (typeof od === 'object' && od.id && typeof od.id === 'string' && od.id.startsWith(IDPrefix.Record)) {
        return null;
      }
      const recordId = p[1] as string;
      const fieldId = p[3];
      const field = snapshot.meta.fieldMap[fieldId];
      if (!field) return null;
      let oiField: IField | undefined = field;
      let odField: IField | undefined = field;
      // 补全单选、多选 op 中缺失的 field
      // 单选
      if (typeof oi === 'string' && oi.startsWith(IDPrefix.Option)) {
        oiField = supplySelectField({ cacheFieldOptions, fieldId, oiOrOd: oi, field: oiField });
      }
      if (typeof od === 'string' && od.startsWith(IDPrefix.Option)) {
        odField = supplySelectField({ cacheFieldOptions, fieldId, oiOrOd: od, field: odField });
      }
      if (Array.isArray(oi) && typeof oi[0] === 'string') {
        // 多选
        if (oi[0].startsWith(IDPrefix.Option)) {
          oiField = supplyMultiSelectField({ cacheFieldOptions, fieldId, oiOrOd: oi, field: oiField });
        } else if (oi[0].startsWith(IDPrefix.Record)) {
          oiField = supplyExtraField({ cacheFieldOptions, fieldId, revision, field: oiField, isOi: true });
        } else {
          // 成员
          oiField = supplyMemberField({ cacheFieldOptions, fieldId, oiOrOd: oi, field: oiField });
        }
      }
      if (Array.isArray(od) && typeof od[0] === 'string') {
        if (od[0].startsWith(IDPrefix.Option)) {
          odField = supplyMultiSelectField({ cacheFieldOptions, fieldId, oiOrOd: od, field: odField });
        } else if (od[0].startsWith(IDPrefix.Record)) {
          odField = supplyExtraField({ cacheFieldOptions, fieldId, revision, field: odField });
        } else {
          odField = supplyMemberField({ cacheFieldOptions, fieldId, oiOrOd: od, field: odField });
        }
      }
      // 评分、勾选、数字
      if (typeof od === 'number' || typeof od === 'boolean') {
        odField = supplyExtraField({ cacheFieldOptions, fieldId, revision, field: odField });
      }
      if (typeof oi === 'number' || typeof oi === 'boolean') {
        oiField = supplyExtraField({ cacheFieldOptions, fieldId, revision, field: oiField, isOi: true });
      }
      if (Array.isArray(oi) && typeof oi[0] === 'object') {
        // 文本或者邮件
        if (oi[0].type) {
          oiField = {
            ...oiField,
            type: SegmentType.Email === oi[0].type ? FieldType.Email : FieldType.Text
          } as IField;
        } else if (oi[0].token) { // 附件
          oiField = {
            type: FieldType.Attachment
          } as IField;
        }
        // 将网址字段存为text的ISegment结构重新转换
        if(oi[0].type && oi[0].type === FieldType.Text) {
          const urlMatch = [...oi[0].text.matchAll(LINK_REG)];
          if(urlMatch.length) {
            oi = string2Segment(oi[0].text);
          }
        }
      }
      if (Array.isArray(od) && typeof od[0] === 'object') {
        if (od[0].type) {
          odField = {
            ...odField,
            type: SegmentType.Email === od[0].type ? FieldType.Email : FieldType.Text
          } as IField;
        } else {
          odField = {
            type: FieldType.Attachment
          } as IField;
        }
      }

      // 检查上一个 action 是否是类型切换
      let preTypeSwitch = false;
      if (index > 0) {
        const { p: preP, od: preOd, oi: preOi } = (actions as any)[index - 1];
        preTypeSwitch = preP[0] === 'meta' && preP[1] === 'fieldMap' && preOd && preOi && preOd.type !== preOi.type;
      }

      // 检查下一个 action 是否是类型切换（撤销操作）
      let nextTypeSwitch = false;
      if (index === 0) {
        const { p: nextP, od: preOd, oi: preOi } = (actions as any)[1] || {};
        nextTypeSwitch = nextP && nextP[0] === 'meta' && nextP[1] === 'fieldMap' && preOd && preOi && preOd.type !== preOi.type;
      }

      // diff 条件判断：oi、od 均为数组并且
      // 数组元素为 object 时根据 id（必须） 做 diff
      // 数组元素为 string 时根据元素本身（比如 optId、recId）做 diff
      const shouldDiff = Array.isArray(oi) && Array.isArray(od) &&
        (typeof oi[0] === 'object' ? has(oi, '0.id') : Boolean(oi[0])) &&
        (typeof od[0] === 'object' ? has(od, '0.id') : Boolean(od[0]));
      let diff = shouldDiff ? intersectionWith(oi, od, isEqual) : null;
      if (diff) {
        const compare = item => typeof item === 'object' ? item.id : item;
        oi = xorBy(oi, diff, compare);
        od = xorBy(od, diff, compare);
        if (oi.length === 0) {
          oi = null;
        }
        if (od.length === 0) {
          od = null;
        }
        if (diff.length === 0) {
          diff = null;
        }
      }

      return (
        <div className={styles.changesetAction}>
          {!preTypeSwitch && !nextTypeSwitch && (
            <div className={styles.header}>
              <FieldTitle
                fieldId={fieldId}
                datasheetId={datasheetId}
                onMouseDown={(e) => {
                  updateFocusFieldId(fieldId);
                  stopPropagation(e);
                }}
                hideDesc
                hideLock
                hover
                hideRequired
                iconColor="currentcolor"
              />
            </div>
          )}
          {nextTypeSwitch && (
            <FieldSwitchTitle od={(actions[1] as any).od} oi={(actions[1] as any).oi} />
          )}
          {diff != null && odField && (
            <div className={cls(styles.diff, {
              [styles.text]: odField && TEXT_TYPES.includes(odField.type),
              [styles.attachment]: odField && [FieldType.Attachment].includes(odField.type)
            })}>
              <CellValue
                recordId={recordId}
                field={odField}
                cellValue={diff}
                readonly
              />
            </div>
          )}
          {od != null && odField && (
            <div className={cls(styles.old, {
              [styles.text]: odField && TEXT_TYPES.includes(odField.type),
              [styles.attachment]: odField && [FieldType.Attachment].includes(odField.type)
            })}>
              <CellValue
                recordId={recordId}
                field={odField}
                cellValue={od}
                readonly
              />
            </div>
          )}
          {oi != null && oiField && (
            <div className={cls(styles.new, {
              [styles.text]: oiField && TEXT_TYPES.includes(oiField.type),
              [styles.attachment]: oiField && [FieldType.Attachment].includes(oiField.type)
            })}>
              <CellValue
                recordId={recordId}
                field={oiField}
                cellValue={oi}
                readonly
                isActive
              />
            </div>
          )}
        </div>
      );
      // 修改列类型
      // 过滤撤销删除，此时 action.od === undefined
    } else if (p[0] === 'meta' && p[1] === 'fieldMap' && (action as any).od != null) {
      const { od: preOd, oi: preOi } = action as any;
      if (index === 0 && preOd && preOi && preOd.type !== preOi.type) {
        return <FieldSwitchTitle od={od} oi={oi} />;
      }
    }
    return null;
  };

  return (
    <div>
      {actions.map((at, index) => (
        <ActionItem key={index} action={at} index={index} />
      ))}
    </div>
  );
};

export const ChangesetItemAction = React.memo(ChangesetItemActionBase);