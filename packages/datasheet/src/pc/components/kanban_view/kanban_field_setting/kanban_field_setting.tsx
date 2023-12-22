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

import { useClickAway } from 'ahooks';
import { Modal, Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import classNames from 'classnames';
import * as React from 'react';
import { useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Button, ThemeProvider, WrapperTooltip, Typography } from '@apitable/components';
import { CollaCommandName, ConfigConstant, ExecuteResult, FieldType, IField, KanbanStyleKey, Selectors, Strings, t } from '@apitable/core';
import { AddOutlined, ChevronLeftOutlined } from '@apitable/icons';
import { ScreenSize } from 'pc/components/common/component_display';
import { FieldPermissionLock } from 'pc/components/field_permission';
import { getFieldTypeIcon } from 'pc/components/multi_grid/field_setting';
import { DATASHEET_VIEW_CONTAINER_ID } from 'pc/components/view/id';
import { useShowViewLockModal } from 'pc/components/view_lock/use_show_view_lock_modal';
import { useResponsive } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { useCommand } from '../hooks/use_command';
import { KanbanMember } from './kanban_member';
import { KanbanOption } from './kanban_option/kanban_option';
import styles from './styles.module.less';

enum KanbanRoute {
  Init,
  Member,
  Option,
}

interface IKanbanFieldSettingModalProps {
  onClose?(): void;
}

interface ISettingHeadProps {
  route: KanbanRoute;
  setRoute: React.Dispatch<React.SetStateAction<KanbanRoute>>;
}

const SettingHead: React.FC<React.PropsWithChildren<ISettingHeadProps>> = ({ route, setRoute }) => {
  return (
    <div className={styles.header}>
      {route !== KanbanRoute.Init && (
        <div
          className={styles.back}
          onClick={() => {
            setRoute(KanbanRoute.Init);
          }}
        >
          <ChevronLeftOutlined size={16} />
          {t(Strings.back)}
        </div>
      )}
      <Typography ellipsis variant="h6" className={styles.title} style={{ marginRight: route !== KanbanRoute.Init ? 44 : 0 }}>
        {t(Strings.kanban_setting_title)}
      </Typography>
      <span />
    </div>
  );
};

export const KanbanFieldSettingModal: React.FC<React.PropsWithChildren<IKanbanFieldSettingModalProps>> = ({ onClose }) => {
  const [route, setRoute] = useState<KanbanRoute>(KanbanRoute.Init);
  const columnCount = useAppSelector(Selectors.getColumnCount)!;
  const groupFieldId = useAppSelector(Selectors.getKanbanFieldId);
  const command = useCommand();
  const fieldCreatable = useAppSelector((state) => Selectors.getPermissions(state).fieldCreatable);
  const fieldMap = useAppSelector((state) => Selectors.getFieldMap(state, state.pageParams.datasheetId!));
  const ref = useRef<HTMLDivElement>(null);
  const fieldPermissionMap = useAppSelector(Selectors.getFieldPermissionMap);
  const viewId = useAppSelector(Selectors.getActiveViewId)!;
  const isCryptoField = Boolean(groupFieldId && Selectors.getFieldRoleByFieldId(fieldPermissionMap, groupFieldId) === ConfigConstant.Role.None);
  const isViewLock = useShowViewLockModal();

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const canUseKanbanFields = useMemo(() => {
    const ids = Object.values(fieldMap!).reduce<IField[]>((fields, field) => {
      if (field.type === FieldType.SingleSelect) {
        fields.push(field);
      }
      if (field.type === FieldType.Member && !field.property.isMulti) {
        fields.push(field);
      }
      return fields;
    }, []);
    if (isCryptoField && groupFieldId) {
      ids.push({
        id: groupFieldId,
        type: FieldType.NotSupport,
        name: t(Strings.crypto_field),
        property: null,
      });
    }
    return ids;
  }, [fieldMap, groupFieldId, isCryptoField]);

  const modalHeight = useMemo(() => {
    return !ref.current ? 'auto' : ref.current.clientHeight;
    // eslint-disable-next-line
  }, [route]);

  function commandHandle(newField: IField) {
    const result = command.addField(newField, columnCount);
    if (ExecuteResult.Success === result.result) {
      command.setKanbanStyle(
        {
          styleKey: KanbanStyleKey.KanbanFieldId,
          styleValue: newField.id,
        },
        newField.type === FieldType.Member,
      );
      resourceService.instance!.commandManager.execute({
        cmd: CollaCommandName.SetGroup,
        viewId,
        data: [{ fieldId: newField.id, desc: false }],
      });
    }
  }

  function radioChange(e: RadioChangeEvent) {
    const value = e.target.value;
    command.setKanbanStyle({
      styleKey: KanbanStyleKey.KanbanFieldId,
      styleValue: value,
    });
    resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.SetGroup,
      viewId,
      data: [{ fieldId: value, desc: false }],
    });
  }

  useClickAway(
    () => {
      onClose && onClose();
    },
    ref,
    'mousedown',
  );
  const modalWidth = isMobile ? 330 : 480;
  return (
    <Modal
      visible
      title={null}
      closable={false}
      onCancel={() => {
        onClose && onClose();
      }}
      destroyOnClose
      footer={null}
      maskClosable
      width={modalWidth}
      centered
      getContainer={() => document.getElementById(DATASHEET_VIEW_CONTAINER_ID)!}
      maskStyle={{ position: 'absolute' }}
      wrapClassName={styles.modalWrap}
      zIndex={0}
    >
      <div style={{ height: modalHeight }} ref={ref} className={styles.kanbanFieldSetting}>
        <div className={styles.animation} style={{ transform: `translateX(${route !== KanbanRoute.Init ? -modalWidth : 0}px)` }}>
          <div className={styles.slide}>
            <SettingHead route={route} setRoute={setRoute} />
            <p className={styles.noFieldTip}>{t(Strings.kanban_setting_tip)}</p>
            {
              <Radio.Group value={groupFieldId} className={styles.radioGroup} onChange={radioChange}>
                {canUseKanbanFields.map((field) => {
                  return (
                    <div key={field.id} className={styles.radioWrapper}>
                      <WrapperTooltip wrapper={isViewLock} tip={t(Strings.view_lock_setting_desc)}>
                        <span>
                          <Radio
                            value={field.id}
                            key={field.id}
                            className={styles.radio}
                            disabled={(isCryptoField && field.id === groupFieldId) || isViewLock}
                          >
                            {!isCryptoField && getFieldTypeIcon(field.type)}
                            {field.name}
                          </Radio>
                        </span>
                      </WrapperTooltip>
                      <FieldPermissionLock fieldId={field.id} />
                    </div>
                  );
                })}
              </Radio.Group>
            }
            {fieldCreatable && (
              <>
                <WrapperTooltip wrapper={isViewLock} tip={t(Strings.view_lock_setting_desc)}>
                  <div className={classNames(styles.fieldItem, { [styles.disabled]: isViewLock })} onClick={() => setRoute(KanbanRoute.Option)}>
                    <AddOutlined className={styles.addIcon} />
                    {t(Strings.kanban_setting_create_option)}
                  </div>
                </WrapperTooltip>
                <WrapperTooltip wrapper={isViewLock} tip={t(Strings.view_lock_setting_desc)}>
                  <div className={classNames(styles.fieldItem, { [styles.disabled]: isViewLock })} onClick={() => setRoute(KanbanRoute.Member)}>
                    <AddOutlined className={styles.addIcon} />
                    {t(Strings.kanban_setting_create_member)}
                  </div>
                </WrapperTooltip>
              </>
            )}
            <Button
              color="primary"
              disabled={!onClose}
              className={classNames(styles.submitButton, styles.relativeButton)}
              onClick={() => {
                onClose && onClose();
              }}
              size={'small'}
            >
              {t(Strings.submit)}
            </Button>
          </div>
          <div className={styles.slide}>
            {route !== KanbanRoute.Init && <SettingHead route={route} setRoute={setRoute} />}
            {route === KanbanRoute.Option && <KanbanOption fieldMap={fieldMap!} command={commandHandle} onClose={onClose} />}
            {route === KanbanRoute.Member && <KanbanMember fieldMap={fieldMap!} command={commandHandle} onClose={onClose} />}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export function showKanbanSetting() {
  const div = document.createElement('div');
  document.getElementById(DATASHEET_VIEW_CONTAINER_ID)!.appendChild(div);
  const root = createRoot(div);

  function destroy() {
    root.unmount();
    if (div.parentNode) {
      div.parentNode.removeChild(div);
    }
  }

  function close() {
    setTimeout(() => {
      destroy();
    }, 0);
  }

  function render() {
    setTimeout(() => {
      root.render(
        <Provider store={store}>
          <ThemeProvider>
            <KanbanFieldSettingModal onClose={close} />
          </ThemeProvider>
        </Provider>,
      );
    });
  }

  render();
}
