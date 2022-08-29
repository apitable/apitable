import { CollaCommandName, ExecuteResult, getUniqName, IField, IFieldMap, Strings, t } from '@vikadata/core';
import { notifyWithUndo } from 'pc/components/common/notify';
import { NotifyKey } from 'pc/components/common/notify/notify.interface';
import { resourceService } from 'pc/resource_service';
import { DEFAULT_FONT_FAMILY, getTextWidth } from 'pc/utils';

export const getShowFieldName = (name: string) => {
  const fieldNameWidth = getTextWidth(name, `13px ${DEFAULT_FONT_FAMILY}`);
  if (fieldNameWidth > 80) {
    const cutIndex = Math.floor((80 / fieldNameWidth) * name.length);
    return name.slice(0, cutIndex) + '...';
  }
  return name;
};

export const getCopyField = (field: IField, fieldMap: IFieldMap, viewId?: string, datasheetId?: string) => {
  const commandManager = resourceService.instance!.commandManager;
  return (index: number, fieldId: string, offset: number, hiddenColumn?: boolean) => {
    const result = commandManager.execute({
      cmd: CollaCommandName.AddFields,
      copyCell: true,
      fieldId: field.id,
      data: [{
        data: {
          name: getUniqName(
            field.name + t(Strings.copy),
            Object.keys(fieldMap).map(id => fieldMap[id].name),
          ),
          type: field.type,
          property: field.property,
        },
        viewId: viewId,
        index: index,
        fieldId,
        offset,
        hiddenColumn,
      }],
      datasheetId
    });

    if (ExecuteResult.Success === result.result) {
      notifyWithUndo(t(Strings.toast_duplicate_field_success), NotifyKey.DuplicateField);
    }
  };
};
