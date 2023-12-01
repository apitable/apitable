/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Col, Row } from 'antd';
import { isEqual } from 'lodash';
import { FC, useContext, useEffect, useState } from 'react';
import { colorVars, IconButton, WrapperTooltip } from '@apitable/components';
import {
  ConfigConstant,
  FieldType,
  FilterConjunction as FilterConjunctionEnum,
  IFieldMap,
  IFilterInfo,
  ILookUpField,
  IViewColumn,
  Selectors,
  Strings,
  t,
} from '@apitable/core';
import { DeleteOutlined } from '@apitable/icons';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { checkComputeRef } from 'pc/components/multi_grid/field_setting';
import { InvalidValue } from 'pc/components/tool_bar/view_filter/invalid_value';
import { ViewFilterContext } from 'pc/components/tool_bar/view_filter/view_filter_context';
import { useAppSelector } from 'pc/store/react-redux';
import { FilterConjunction } from './filter_conjunction/filter_conjunction';
import { FilterFieldList } from './filter_field_list';
import { FilterOperate } from './filter_operate';
import { FilterValue } from './filter_value';
import { ExecuteFilterFn } from './interface';
import styles from './style.module.less';

interface IConditionList {
  filterInfo?: IFilterInfo;
  fieldMap: IFieldMap;
  datasheetId?: string;
  changeFilter: (cb: ExecuteFilterFn) => void;
  deleteFilter: (idx: number) => void;
  field?: ILookUpField;
}

const ConditionList: FC<React.PropsWithChildren<IConditionList>> = (props) => {
  const { filterInfo, fieldMap, changeFilter, deleteFilter, datasheetId, field } = props;
  const { conditions, conjunction = FilterConjunctionEnum.And } = filterInfo || {};
  const columns = useAppSelector((state) => {
    const view = Selectors.getCurrentView(state, datasheetId);
    return view!.columns as IViewColumn[];
  });
  const fieldPermissionMap = useAppSelector(Selectors.getFieldPermissionMap);
  const { isViewLock } = useContext(ViewFilterContext);

  // Check if the magic lookup filter is circularly referenced
  const [warnTextObj, setWarnTextObj] = useState<{ string?: string }>({});
  useEffect(() => {
    if (field) {
      const newWarnTextObj = {};
      columns.forEach((column) => {
        const foreignFieldId = fieldMap[column.fieldId];
        if ([FieldType.LookUp, FieldType.Formula].includes(foreignFieldId.type)) {
          const warnText = checkComputeRef({
            ...field,
            property: {
              ...field.property,
              lookUpTargetFieldId: foreignFieldId.id,
            },
          });
          if (typeof warnText === 'string') {
            newWarnTextObj[column.fieldId] = warnText;
          }
        }
      });
      if (!isEqual(newWarnTextObj, warnTextObj)) {
        setWarnTextObj(newWarnTextObj);
      }
    }
  }, [field, columns, fieldMap, warnTextObj]);
  if (!conditions) {
    return <></>;
  }
  return (
    <div className={styles.condition}>
      {conditions.map((item, index) => {
        const conditionField = fieldMap[item.fieldId];
        const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, item.fieldId);
        const isCryptoField = Boolean(fieldRole && fieldRole === ConfigConstant.Role.None);
        const fieldNotFound = !isCryptoField && !conditionField;

        const publicProps = {
          condition: item,
          conditionIndex: index,
          changeFilter,
          isCryptoField,
          fieldNotFound,
        };

        return (
          <div key={item.conditionId} className={styles.conditionItem}>
            <ComponentDisplay minWidthCompatible={ScreenSize.md}>
              <FilterConjunction conditionIndex={index} conjunction={conjunction} changeFilter={changeFilter} />
              <FilterFieldList columns={columns} fieldMap={fieldMap} warnTextObj={warnTextObj} {...publicProps} />
              {!isCryptoField && !fieldNotFound ? (
                <>
                  <FilterOperate conditions={conditions} fieldMap={fieldMap} field={conditionField} {...publicProps} />
                  <FilterValue primaryField={field} field={conditionField} {...publicProps} />
                </>
              ) : (
                <InvalidValue style={{ maxWidth: 298 }} content={fieldNotFound ? t(Strings.current_field_fail) : undefined} />
              )}
              <WrapperTooltip wrapper={isViewLock} tip={t(Strings.view_lock_setting_desc)}>
                <div>
                  <IconButton
                    onClick={deleteFilter.bind(null, index)}
                    icon={() => <DeleteOutlined size={15} color={colorVars.thirdLevelText} />}
                    disabled={isViewLock}
                  />
                </div>
              </WrapperTooltip>
            </ComponentDisplay>

            <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
              <FilterConjunction conditionIndex={index} conjunction={conjunction} changeFilter={changeFilter} />
              <Row align="middle" style={{ width: '100%' }} gutter={[0, 8]}>
                <Col span={22}>
                  <Row align="middle" style={{ width: '100%' }} gutter={[0, 8]}>
                    <Col span={16}>
                      <FilterFieldList columns={columns} fieldMap={fieldMap} warnTextObj={warnTextObj} {...publicProps} />
                    </Col>
                    <Col span={8}>
                      {!isCryptoField && !fieldNotFound ? (
                        <FilterOperate conditions={conditions} fieldMap={fieldMap} field={conditionField} {...publicProps} />
                      ) : (
                        <InvalidValue style={{ maxWidth: 298 }} content={fieldNotFound ? t(Strings.current_field_fail) : undefined} />
                      )}
                    </Col>
                  </Row>
                  {!isCryptoField && !fieldNotFound && (
                    <Row align="middle" style={{ width: '100%' }}>
                      <Col span={24} style={{ paddingLeft: 1 }}>
                        <FilterValue primaryField={field} field={conditionField} {...publicProps} />
                      </Col>
                    </Row>
                  )}
                </Col>
                <Col
                  span={2}
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton
                    onClick={deleteFilter.bind(null, index)}
                    icon={() => <DeleteOutlined size={15} color={colorVars.thirdLevelText} />}
                    disabled={isViewLock}
                  />
                </Col>
              </Row>
            </ComponentDisplay>
          </div>
        );
      })}
    </div>
  );
};

export default ConditionList;
