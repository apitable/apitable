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
import * as React from 'react';
import { useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult, ResponderProvided } from 'react-beautiful-dnd';
import { useThemeColors, WrapperTooltip } from '@apitable/components';
import { ConfigConstant, Selectors, Strings, t } from '@apitable/core';
import { DeleteOutlined, DragOutlined } from '@apitable/icons';
import { ButtonPlus } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { InvalidValue } from 'pc/components/tool_bar/view_filter/invalid_value';
import { useShowViewLockModal } from 'pc/components/view_lock/use_show_view_lock_modal';
import { useAppSelector } from 'pc/store/react-redux';
import styles from '../style.module.less';
import { ViewFieldOptions } from '../view_field_options';
import { ViewFieldOptionsMobile } from '../view_field_options/view_field_options_mobile';
import { ViewRules } from '../view_rules';

interface ICommonViewSetProps {
  onDragEnd(result: DropResult, provided: ResponderProvided): void;
  dragData: { fieldId: string; desc: boolean }[];
  setField(index: number, fieldId: string): void;
  existFieldIds: string[];
  setRules(index: number, desc: boolean): void;
  deleteItem(index: number): void;
  invalidFieldIds?: string[];
  invalidTip?: string;
}

export const CommonViewSet: React.FC<React.PropsWithChildren<ICommonViewSetProps>> = (props) => {
  const colors = useThemeColors();
  const { onDragEnd: propDragEnd, dragData, setField, existFieldIds, setRules, deleteItem, invalidFieldIds = [], invalidTip } = props;
  const [disableDrag, setDisableDrag] = useState(true);
  const fieldPermissionMap = useAppSelector(Selectors.getFieldPermissionMap);
  const fieldMap = useAppSelector((state) => Selectors.getFieldMap(state, state.pageParams.datasheetId!));
  const isViewLock = useShowViewLockModal();

  function onMouseOver() {
    if (isViewLock) {
      return;
    }
    setDisableDrag(false);
  }

  function onDragEnd(result: DropResult, provided: ResponderProvided) {
    if (isViewLock) {
      return;
    }
    propDragEnd(result, provided);
    setDisableDrag(false);
  }

  function fieldSettingItem(index: number) {
    if (!fieldMap) {
      return;
    }
    const fieldId = dragData[index].fieldId;
    const isInvalid = invalidFieldIds.some((di) => di === fieldId);
    const isCryptoField = Selectors.getFieldRoleByFieldId(fieldPermissionMap, fieldId) === ConfigConstant.Role.None;
    const fieldNotFound = !isCryptoField && !fieldMap[fieldId];
    return (
      <>
        <ComponentDisplay minWidthCompatible={ScreenSize.md}>
          <WrapperTooltip wrapper={isViewLock} tip={t(Strings.view_lock_setting_desc)}>
            <div className={styles.iconDrag} onMouseOver={onMouseOver}>
              <DragOutlined size={16} color={colors.fourthLevelText} />
            </div>
          </WrapperTooltip>

          {/* option list */}
          <ViewFieldOptions
            index={index}
            onChange={setField.bind(null, index)}
            existFieldIds={existFieldIds}
            defaultFieldId={fieldId}
            isCryptoField={isCryptoField}
            fieldNotFound={fieldNotFound}
          />
          {/* Sorting Rules */}
          {isCryptoField || fieldNotFound ? (
            <InvalidValue style={{ marginLeft: 20, maxWidth: 185 }} content={fieldNotFound ? t(Strings.current_field_fail) : undefined} />
          ) : (
            <ViewRules index={index} onChange={setRules.bind(null, index)} rulesItem={dragData[index]} invalid={isInvalid} invalidTip={invalidTip} />
          )}
          <WrapperTooltip wrapper={isViewLock} tip={t(Strings.view_lock_setting_desc)}>
            <div style={{ marginLeft: 10 }}>
              <ButtonPlus.Icon
                onClick={() => !isViewLock && deleteItem(index)}
                size="x-small"
                style={{ color: colors.fourthLevelText, cursor: isViewLock ? 'not-allowed' : 'pointer' }}
                icon={<DeleteOutlined size={15} color={colors.fourthLevelText} />}
              />
            </div>
          </WrapperTooltip>
        </ComponentDisplay>

        <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
          <Row align="middle" gutter={[0, 8]} style={{ width: '100%' }} onTouchMove={onMouseOver}>
            <Col span={1}>
              <div className={styles.iconDrag}>
                <DragOutlined size={14} color={colors.thirdLevelText} />
              </div>
            </Col>
            <Col span={9}>
              <div className={styles.optionsWrapper}>
                <ViewFieldOptionsMobile
                  onChange={setField.bind(null, index)}
                  existFieldIds={existFieldIds}
                  defaultFieldId={fieldId}
                  isCryptoField={isCryptoField}
                  fieldNotFound={fieldNotFound}
                />
              </div>
            </Col>
            <Col span={12}>
              {/* Sorting Rules */}
              {isCryptoField || fieldNotFound ? (
                <InvalidValue style={{ marginLeft: 20, maxWidth: 185 }} content={fieldNotFound ? t(Strings.current_field_fail) : undefined} />
              ) : (
                <ViewRules
                  index={index}
                  onChange={setRules.bind(null, index)}
                  rulesItem={dragData[index]}
                  invalid={isInvalid}
                  invalidTip={invalidTip}
                />
              )}
            </Col>
            <Col span={2}>
              <div className={styles.delBtnWrapper}>
                <ButtonPlus.Icon
                  onClick={() => deleteItem(index)}
                  size="x-small"
                  style={{ color: colors.fourthLevelText }}
                  icon={<DeleteOutlined size={16} color={colors.fourthLevelText} />}
                />
              </div>
            </Col>
          </Row>
        </ComponentDisplay>
      </>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="common-view-set" direction="vertical">
        {(provided) => {
          return (
            <div className={styles.droppable} ref={provided.innerRef} {...provided.droppableProps}>
              {dragData.map((item, index) => {
                return (
                  <Draggable draggableId={item.fieldId + index} index={index} key={index} isDragDisabled={disableDrag}>
                    {(providedChild) => (
                      <div
                        className={styles.draggable}
                        ref={providedChild.innerRef}
                        {...providedChild.draggableProps}
                        {...providedChild.dragHandleProps}
                      >
                        {fieldSettingItem(index)}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
};
