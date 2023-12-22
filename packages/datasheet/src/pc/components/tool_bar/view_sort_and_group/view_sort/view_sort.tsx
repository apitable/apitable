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
import produce from 'immer';
import * as React from 'react';
import { useCallback, useMemo, useRef } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import {
  Button,
  IUseListenTriggerInfo,
  Switch,
  TextButton,
  Typography,
  useListenVisualHeight,
  useThemeColors,
  WrapperTooltip,
} from '@apitable/components';
import { CollaCommandName, FieldType, ISortInfo, Selectors, Strings, t } from '@apitable/core';
import { QuestionCircleOutlined } from '@apitable/icons';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { useShowViewLockModal } from 'pc/components/view_lock/use_show_view_lock_modal';
import { useResponsive } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { executeCommandWithMirror } from 'pc/utils/execute_command_with_mirror';
import { SyncViewTip } from '../../sync_view_tip';
import { CommonViewSet } from '../common_view_set';
import styles from '../style.module.less';
import { ViewFieldOptions } from '../view_field_options';
import { ViewFieldOptionsMobile } from '../view_field_options/view_field_options_mobile';

interface IViewSetting {
  close(e: React.MouseEvent): void;
  triggerInfo?: IUseListenTriggerInfo;
}

const MIN_HEIGHT = 120;
const MAX_HEIGHT = 340;

export const ViewSort: React.FC<React.PropsWithChildren<IViewSetting>> = (props) => {
  const { triggerInfo } = props;
  const colors = useThemeColors();
  const activeViewGroupInfo = useAppSelector(Selectors.getActiveViewGroupInfo);
  const fieldMap = useAppSelector((state) => {
    return Selectors.getFieldMap(state, state.pageParams.datasheetId!);
  })!;
  const sortInfo = useAppSelector(Selectors.getActiveViewSortInfo);
  const activityViewId = useAppSelector(Selectors.getActiveViewId)!;
  const sortFieldIds = sortInfo ? sortInfo.rules.map((item) => item.fieldId) : [];
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const { editable } = useAppSelector(Selectors.getPermissions);
  const isViewLock = useShowViewLockModal();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const { style, onListenResize } = useListenVisualHeight({
    listenNode: containerRef,
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
    triggerInfo,
  });

  function submitSort(viewInfo: ISortInfo, applySort?: boolean) {
    const sortInfo = viewInfo?.rules?.length ? viewInfo : undefined;
    const _applySort = applySort && editable;
    executeCommandWithMirror(
      () => {
        resourceService.instance!.commandManager.execute({
          cmd: CollaCommandName.SetSortInfo,
          viewId: activityViewId,
          data: sortInfo,
          applySort: _applySort,
        });
      },
      {
        sortInfo: sortInfo,
      },
      () => {
        if (_applySort) {
          resourceService.instance!.commandManager.execute({
            cmd: CollaCommandName.SetSortInfo,
            viewId: activityViewId,
            data: sortInfo,
            applySort: _applySort,
          });
        }
      },
    );
  }

  const invalidFieldsByGroup = useMemo(() => {
    const invalidFields: string[] = [];
    activeViewGroupInfo.forEach((item) => {
      const field = fieldMap[item.fieldId];
      // Sorting is invalid after non-multi-selected FieldType grouping.
      if (field && ![FieldType.MultiSelect].includes(field.type)) {
        invalidFields.push(field.id);
      }
    });
    return invalidFields;
  }, [activeViewGroupInfo, fieldMap]);

  // Modify the order after the end of dragging.
  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination } = result;
      if (!destination) {
        return;
      }
      submitSort(
        produce(sortInfo, (draft) => {
          draft!.rules.splice(destination.index, 0, draft!.rules.splice(source.index, 1)[0]);
          return draft;
        })!,
      );
    },
    // eslint-disable-next-line
    [sortInfo],
  );

  function deleteViewItem(index: number) {
    if (sortInfo) {
      const newSortInfo = produce(sortInfo, (draft) => {
        draft.rules.splice(index, 1).filter((item) => invalidFieldsByGroup.includes(item.fieldId));
        return draft;
      });
      submitSort(newSortInfo);
    }
  }

  function setSortRules(index: number, desc: boolean) {
    const newSortInfo = produce(sortInfo, (draft: ISortInfo) => {
      draft!.rules.map((item, idx) => {
        if (idx === index) {
          item.desc = desc;
        }
        return item;
      });
      return draft!;
    });
    submitSort(newSortInfo!);
  }

  function setSortField(index: number, fieldId: string) {
    const newSortInfo = produce(sortInfo, (draft: ISortInfo) => {
      if (!draft) {
        return {
          keepSort: true,
          rules: [{ fieldId, desc: false }],
        };
      }
      draft.rules[index] = { fieldId, desc: false };
      return draft;
    });
    submitSort(newSortInfo!);
  }

  function onChange(check: boolean) {
    const newSortInfo = {
      ...sortInfo!,
      keepSort: check,
    };
    submitSort(newSortInfo, check ? false : true);
  }

  // TODO: Relocation.
  const manualSort = sortInfo && !sortInfo.keepSort;
  const mainContentStyle: React.CSSProperties = isMobile
    ? {
      maxHeight: manualSort ? 'calc(100% - 104px)' : 'calc(100% - 36px)',
    }
    : {};

  React.useEffect(() => {
    onListenResize();
  }, [sortInfo, onListenResize]);

  return (
    <div className={styles.viewSort} style={!isMobile ? style : undefined} ref={containerRef}>
      <div className={styles.boxTop}>
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant={'h7'}>{t(Strings.set_sort)}</Typography>
            <a href={t(Strings.sort_help_url)} target="_blank" rel="noopener noreferrer">
              <QuestionCircleOutlined color={colors.thirdLevelText} />
            </a>
          </div>
        )}
        {Boolean(sortInfo && sortInfo.rules.length) && (
          <div className={styles.keepSort}>
            {t(Strings.keep_sort)}
            <WrapperTooltip wrapper={isViewLock} tip={t(Strings.view_lock_setting_desc)}>
              <Switch
                checked={sortInfo!.keepSort}
                size={isMobile ? 'default' : 'small'}
                style={{ marginLeft: isMobile ? 8 : 4 }}
                onChange={onChange}
                disabled={isViewLock}
              />
            </WrapperTooltip>
          </div>
        )}
      </div>
      {!isMobile && <SyncViewTip style={{ paddingLeft: 20 }} />}
      <main style={mainContentStyle}>
        {sortInfo && (
          <CommonViewSet
            onDragEnd={onDragEnd}
            dragData={sortInfo.rules}
            setField={setSortField}
            existFieldIds={sortFieldIds}
            setRules={setSortRules}
            deleteItem={deleteViewItem}
            invalidFieldIds={invalidFieldsByGroup}
            invalidTip={t(Strings.invalid_action_sort_tip)}
          />
        )}
      </main>
      <div className={styles.selectField}>
        <ComponentDisplay minWidthCompatible={ScreenSize.md}>
          <ViewFieldOptions
            isAddNewOption
            onChange={setSortField.bind(null, sortFieldIds.length)}
            defaultFieldId={t(Strings.add_sort)}
            existFieldIds={sortFieldIds}
            invalidFieldIds={invalidFieldsByGroup}
            invalidTip={t(Strings.invalid_option_sort_tip)}
          />
        </ComponentDisplay>
        <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
          <Row align="middle" style={{ width: '100%' }}>
            <Col span={sortInfo ? 9 : 10} offset={sortInfo ? 1 : 0}>
              <div style={{ paddingLeft: sortInfo ? 8 : 0, paddingRight: 8 }}>
                <ViewFieldOptionsMobile
                  defaultFieldId={t(Strings.sort_rules)}
                  existFieldIds={sortFieldIds}
                  onChange={setSortField.bind(null, sortFieldIds.length)}
                />
              </div>
            </Col>
          </Row>
        </ComponentDisplay>
      </div>
      {manualSort && (
        <div className={styles.buttonWrapper}>
          {isMobile ? (
            <Button
              style={{ marginRight: '16px' }}
              size="large"
              onClick={(e) => {
                props.close(e as any as React.MouseEvent);
              }}
              block
              disabled={isViewLock}
            >
              <span style={{ color: colors.thirdLevelText }}>{t(Strings.cancel)}</span>
            </Button>
          ) : (
            <TextButton
              style={{ marginRight: '16px' }}
              size="small"
              onClick={(e) => {
                props.close(e as any as React.MouseEvent);
              }}
              disabled={isViewLock}
            >
              <span style={{ color: colors.thirdLevelText }}>{t(Strings.cancel)}</span>
            </TextButton>
          )}
          <WrapperTooltip wrapper={isViewLock} tip={t(Strings.view_lock_setting_desc)}>
            <Button
              color="primary"
              size={isMobile ? 'large' : 'small'}
              onClick={(e) => {
                sortInfo && submitSort(sortInfo, true);
                props.close(e as any as React.MouseEvent);
              }}
              block={isMobile}
              disabled={isViewLock}
            >
              <span>{t(Strings.sort_apply)}</span>
            </Button>
          </WrapperTooltip>
        </div>
      )}
    </div>
  );
};
