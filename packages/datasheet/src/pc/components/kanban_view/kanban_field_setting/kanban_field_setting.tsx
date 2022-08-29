import { CollaCommandName, ConfigConstant, ExecuteResult, FieldType, IField, KanbanStyleKey, Selectors, Strings, t } from '@vikadata/core';
import { store } from 'pc/store';
import { useClickAway } from 'ahooks';
import { Modal, Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import { Button, ThemeProvider } from '@vikadata/components';
import { getFieldTypeIcon } from 'pc/components/multi_grid/field_setting';
import { DATASHEET_VIEW_CONTAINER_ID } from 'pc/components/view';
import { useMemo, useRef, useState } from 'react';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider, useSelector } from 'react-redux';
import IconAdd from 'static/icon/common/common_icon_add_content.svg';
import IconArrowLeft from 'static/icon/common/common_icon_left_line.svg';
import { useCommand } from '../hooks/use_command';
import { KanbanMember } from './kanban_member';
import { KanbanOption } from './kanban_option/kanban_option';
import styles from './styles.module.less';
import classNames from 'classnames';
import { FieldPermissionLock } from 'pc/components/field_permission';
import { resourceService } from 'pc/resource_service';

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

const SettingHead: React.FC<ISettingHeadProps> = ({ route, setRoute }) => {
  return (
    <div className={styles.header}>
      {
        route !== KanbanRoute.Init &&
        <div
          className={styles.back}
          onClick={() => { setRoute(KanbanRoute.Init); }}
        >
          <IconArrowLeft width={16} height={16} />
          {t(Strings.back)}
        </div>
      }
      <div className={styles.title} style={{ marginRight: route !== KanbanRoute.Init ? 44 : 0 }}>
        {t(Strings.kanban_setting_title)}
      </div>
      <span />
    </div>
  );
};

export const KanbanFieldSettingModal: React.FC<IKanbanFieldSettingModalProps> = ({ onClose }) => {
  const [route, setRoute] = useState<KanbanRoute>(KanbanRoute.Init);
  const columnCount = useSelector(Selectors.getColumnCount)!;
  const groupFieldId = useSelector(Selectors.getKanbanFieldId);
  const command = useCommand();
  const fieldCreatable = useSelector(state => Selectors.getPermissions(state).fieldCreatable);
  const fieldMap = useSelector(state => Selectors.getFieldMap(state, state.pageParams.datasheetId!));
  const ref = useRef<HTMLDivElement>(null);
  const fieldPermissionMap = useSelector(Selectors.getFieldPermissionMap);
  const viewId = useSelector(Selectors.getActiveViewId)!;
  const isCryptoField = Boolean(groupFieldId && Selectors.getFieldRoleByFieldId(fieldPermissionMap, groupFieldId) === ConfigConstant.Role.None);

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
        property: null
      });
    }
    return ids;
  }, [fieldMap, groupFieldId, isCryptoField]);

  const modalHeight = useMemo(() => {
    return !ref.current ? 'auto' : ref.current.clientHeight;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  function commandHandle(newField: IField) {
    const result = command.addField(newField, columnCount);
    if (ExecuteResult.Success === result.result) {
      command.setKanbanStyle({
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

  useClickAway(() => {
    onClose && onClose();
  }, ref, 'mousedown');

  return <Modal
    visible
    title={null}
    closable={false}
    onCancel={() => { onClose && onClose(); }}
    destroyOnClose
    footer={null}
    maskClosable
    width={480}
    centered
    getContainer={() => document.getElementById(DATASHEET_VIEW_CONTAINER_ID)!}
    maskStyle={{ position: 'absolute' }}
    wrapClassName={styles.modalWrap}
    zIndex={0}
  >
    <div style={{ height: modalHeight }} ref={ref} className={styles.kanbanFieldSetting}>
      <div
        className={styles.animation}
        style={{ transform: `translateX(${route !== KanbanRoute.Init ? -480 : 0}px)` }}
      >
        <div className={styles.slide}>
          <SettingHead route={route} setRoute={setRoute} />
          <p className={styles.noFieldTip}>
            {t(Strings.kanban_setting_tip)}
          </p>
          {
            <Radio.Group value={groupFieldId} className={styles.radioGroup} onChange={radioChange}>
              {
                canUseKanbanFields.map(field => {
                  return <div className={styles.radioWrapper}>
                    <Radio value={field.id} key={field.id} className={styles.radio} disabled={isCryptoField && field.id === groupFieldId}>
                      {!isCryptoField && getFieldTypeIcon(field.type)}
                      {field.name}
                    </Radio>
                    <FieldPermissionLock fieldId={field.id} />
                  </div>;
                })
              }
            </Radio.Group>
          }
          {
            fieldCreatable &&
            <>
              <div className={styles.fieldItem} onClick={() => setRoute(KanbanRoute.Option)}>
                <IconAdd className={styles.addIcon} />
                {t(Strings.kanban_setting_create_option)}
              </div>
              <div className={styles.fieldItem} onClick={() => setRoute(KanbanRoute.Member)}>
                <IconAdd className={styles.addIcon} />
                {t(Strings.kanban_setting_create_member)}
              </div>
            </>
          }
          <Button
            color="primary"
            disabled={!onClose}
            className={classNames(styles.submitButton, styles.relativeButton)}
            onClick={() => { onClose && onClose(); }}
            size={'small'}
          >
            {t(Strings.submit)}
          </Button>
        </div>
        <div className={styles.slide}>
          {
            route !== KanbanRoute.Init && <SettingHead route={route} setRoute={setRoute} />
          }
          {
            route === KanbanRoute.Option &&
            <KanbanOption fieldMap={fieldMap!} command={commandHandle} onClose={onClose} />
          }
          {
            route === KanbanRoute.Member &&
            <KanbanMember fieldMap={fieldMap!} command={commandHandle} onClose={onClose} />
          }
        </div>
      </div>
    </div>
  </Modal>;
};

export function showKanbanSetting() {
  const div = document.createElement('div');
  document.getElementById(DATASHEET_VIEW_CONTAINER_ID)!.appendChild(div);

  function destroy() {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
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
      ReactDOM.render(
        (
          <Provider store={store}>
            <ThemeProvider>
              <KanbanFieldSettingModal onClose={close} />
            </ThemeProvider>
          </Provider>
        ),
        div,
      );
    });
  }

  render();
}
