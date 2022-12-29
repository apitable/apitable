import { Button, Typography } from '@apitable/components';
import {
  CollaCommandName, DateTimeField, ExecuteResult, FieldType, GanttStyleKeyType, getNewIds, getUniqName, IDPrefix, Selectors, Strings, t
} from '@apitable/core';
import { Modal } from 'antd';
import Image from 'next/image';
import { notify } from 'pc/components/common/notify';
import { NotifyKey } from 'pc/components/common/notify/notify.interface';
import { DATASHEET_VIEW_CONTAINER_ID } from 'pc/components/view';
import { resourceService } from 'pc/resource_service';
import { executeCommandWithMirror } from 'pc/utils/execute_command_with_mirror';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import GanttCreationDate from 'static/icon/account/gantt_creation.png';
import GanttCreationNoDate from 'static/icon/account/gantt_creation_nodate.png';
import IconAdd from 'static/icon/common/common_icon_add_content.svg';
import styles from './style.module.less';

export const CreateFieldModal = memo((props) => {
  const {
    viewId,
    columnCount,
    exitFieldNames,
    permissions,
    ganttStyle
  } = useSelector(state => {
    const fieldMap = Selectors.getFieldMap(state, state.pageParams.datasheetId!)!;
    return {
      viewId: Selectors.getActiveView(state)!,
      ganttStyle: Selectors.getGanttStyle(state)!,
      columnCount: Selectors.getColumnCount(state)!,
      exitFieldNames: Object.values(fieldMap).map(field => field.name),
      permissions: Selectors.getPermissions(state),
    };
  });
  const manageable = permissions.manageable;

  const generateField = (fieldId: string, name: string) => {
    return {
      id: fieldId,
      name: getUniqName(name, exitFieldNames),
      type: FieldType.DateTime,
      property: DateTimeField.defaultProperty(),
    };
  };

  const onClick = () => {
    // Fields can only be created with administrative privileges
    if (!manageable) {
      return;
    }
    const [startFieldId, endFieldId] = getNewIds(IDPrefix.Field, 2);
    const result = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.AddFields,
      data: [{
        data: generateField(endFieldId, t(Strings.gantt_end_field_name)),
        viewId,
        index: columnCount,
      }, {
        data: generateField(startFieldId, t(Strings.gantt_start_field_name)),
        viewId,
        index: columnCount,
      }],
    });

    if (ExecuteResult.Success === result.result) {
      notify.open({
        message: t(Strings.toast_add_field_success),
        key: NotifyKey.AddField,
      });

      executeCommandWithMirror(() => {
        resourceService.instance!.commandManager.execute({
          cmd: CollaCommandName.SetGanttStyle,
          viewId: viewId!,
          data: [{
            styleKey: GanttStyleKeyType.StartFieldId,
            styleValue: startFieldId,
          }, {
            styleKey: GanttStyleKeyType.EndFieldId,
            styleValue: endFieldId,
          }]
        });
      }, {
        style: {
          ...ganttStyle,
          [GanttStyleKeyType.StartFieldId]: startFieldId,
          [GanttStyleKeyType.EndFieldId]: endFieldId
        }
      });

    }
  };

  return (
    <Modal
      visible
      title={null}
      closable={false}
      destroyOnClose
      footer={null}
      maskClosable
      width={368}
      centered
      getContainer={() => document.getElementById(DATASHEET_VIEW_CONTAINER_ID)!}
      maskStyle={{ position: 'absolute' }}
      wrapClassName={styles.modalWrap}
      zIndex={1}
    >
      <div className={styles.createFieldModal}>
        <div className={styles.banner}>
          <span className={styles.bannerImg}>
            <Image src={manageable ? GanttCreationDate : GanttCreationNoDate} alt="Gantt chart creation time field banner" />
          </span>
        </div>
        <Typography variant="h7" align={'center'}>
          {manageable ? t(Strings.gantt_init_fields_title) : t(Strings.gantt_init_fields_no_permission_title)}
        </Typography>
        <Typography variant="body4" className={styles.desc}>
          {manageable ? t(Strings.gantt_init_fields_desc) : t(Strings.gantt_init_fields_no_permission_desc)}
        </Typography>
        <Button
          color="primary"
          className={styles.createBtn}
          onClick={onClick}
          size={'middle'}
          disabled={!manageable}
          prefixIcon={<IconAdd width={16} height={16} fill={'white'} />}
        >
          {t(Strings.gantt_init_fields_button)}
        </Button>
      </div>
    </Modal>
  );
});
