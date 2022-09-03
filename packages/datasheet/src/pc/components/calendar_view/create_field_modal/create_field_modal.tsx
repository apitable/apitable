import { Button, Typography } from '@vikadata/components';
import {
  CalendarStyleKeyType,
  CollaCommandName,
  DateTimeField,
  ExecuteResult,
  FieldType,
  getNewId,
  getUniqName,
  IDPrefix,
  Selectors,
  Strings,
  t,
} from '@vikadata/core';
import { Modal } from 'antd';
import Image from 'next/image';
import { notify } from 'pc/components/common/notify';
import { NotifyKey } from 'pc/components/common/notify/notify.interface';
import { DATASHEET_VIEW_CONTAINER_ID } from 'pc/components/view';
import { resourceService } from 'pc/resource_service';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import GanttCreationDate from 'static/icon/account/gantt_creation.png';
import OrgChartCreationNoPermission from 'static/icon/account/org_chart_creation_no_permission.png';
import IconAdd from 'static/icon/common/common_icon_add_content.svg';
import styles from './style.module.less';

export const CreateFieldModal = memo(() => {
  const { viewId, columnCount, exitFieldNames, permissions } = useSelector(state => {
    const fieldMap = Selectors.getFieldMap(state, state.pageParams.datasheetId!)!;
    return {
      viewId: Selectors.getActiveView(state)!,
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

  const handleClick = () => {
    // 管理权限才能创建字段
    if (!manageable) {
      return;
    }
    const startFieldId = getNewId(IDPrefix.Field);
    const result = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.AddFields,
      data: [
        {
          data: generateField(startFieldId, t(Strings.start_field_name)),
          viewId,
          index: columnCount,
        },
      ],
    });

    if (ExecuteResult.Success === result.result) {
      notify.open({
        message: t(Strings.toast_add_field_success),
        key: NotifyKey.AddField,
      });

      resourceService.instance!.commandManager.execute({
        cmd: CollaCommandName.SetCalendarStyle,
        viewId: viewId!,
        data: [
          {
            styleKey: CalendarStyleKeyType.StartFieldId,
            styleValue: startFieldId,
          },
        ],
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
      zIndex={12}
    >
      <div className={styles.createFieldModal}>
        <div className={styles.banner}>
          <div className={styles.bannerImg}>
            <Image
              src={manageable ? GanttCreationDate : OrgChartCreationNoPermission}
              alt={t(Strings.calendar_create_img_alt)}
              width={320}
              height={192}
            />
          </div>
        </div>
        <Typography variant="h5" align={'center'}>
          {manageable ? t(Strings.calendar_init_fields_button) : t(Strings.calendar_no_permission)}
        </Typography>
        <Typography variant="body4" className={styles.desc}>
          {manageable ? t(Strings.calendar_init_fields_desc) : t(Strings.calendar_no_permission_desc)}
        </Typography>
        <Button
          color="primary"
          className={styles.createBtn}
          onClick={handleClick}
          disabled={!manageable}
          prefixIcon={<IconAdd width={16} height={16} fill={'white'} />}
        >
          {t(Strings.calendar_init_fields_button)}
        </Button>
      </div>
    </Modal>
  );
});
