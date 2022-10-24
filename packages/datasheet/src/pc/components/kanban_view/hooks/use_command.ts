import { resourceService } from 'pc/resource_service';
import {
  CollaCommandName, ICellValue, IField, FieldType, ISetKanbanStyleValue, Selectors, IViewColumn, ISegment, IKanbanViewProperty
} from '@apitable/core';
import { useSelector } from 'react-redux';
import { store } from 'pc/store';
import { executeCommandWithMirror } from 'pc/utils/execute_command_with_mirror';

interface ISetRecordData {
  recordId: string;
  fieldId: string;
  field?: IField; // 可选，传入 field 信息。适用于在还没有应用到 snapshot 的 field 上 addRecords
  fieldType: FieldType;
  value: ICellValue;
}

export const useCommand = () => {
  const { viewId, datasheetId } = useSelector(state => state.pageParams);
  const view = useSelector(state => Selectors.getCurrentView(state))!;
  const snapshot = useSelector(Selectors.getSnapshot);

  const addRecords = (index: number, count: number, cellValues?: { [fieldId: string]: ICellValue }[]) => {
    return resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.AddRecords,
      viewId: viewId!,
      index,
      count,
      cellValues: cellValues ? cellValues : [{}],
    });
  };

  const setFieldAttr = (fieldId: string, field: IField, dstId?: string) => {
    return resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.SetFieldAttr,
      datasheetId: dstId || datasheetId,
      fieldId,
      data: field,
    });
  };

  const setRecords = (data: ISetRecordData[]) => {
    return resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.SetRecords,
      datasheetId,
      data,
    });
  };

  const addField = (field: IField, index: number) => {
    return resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.AddFields,
      data: [{
        data: {
          ...field,
        },
        viewId,
        index,
      }],
    });
  };

  const setKanbanStyle = (setting: ISetKanbanStyleValue, addRecord?: boolean) => {
    const state = store.getState();
    const { viewId, datasheetId } = state.pageParams;
    const snapshot = Selectors.getSnapshot(state)!;
    const mirror = Selectors.getMirror(state);
    const activeView = Selectors.getCurrentViewBase(snapshot, viewId, datasheetId, undefined, mirror) as IKanbanViewProperty;

    executeCommandWithMirror(() => {
      return resourceService.instance!.commandManager.execute({
        cmd: CollaCommandName.SetKanbanStyle,
        viewId: viewId!,
        addRecord,  
        ...setting,
      });
    }, {
      style: {
        ...activeView.style,
        [setting.styleKey]: setting.styleValue
      }
    }, () => {
      if (addRecord) {
        const unitId = state.user.info!.unitId;
        resourceService.instance!.commandManager.execute({
          cmd: CollaCommandName.AddRecords,
          viewId: viewId!,
          index: activeView.rows.length,
          count: 1,
          cellValues: [{ [setting.styleKey]: [unitId] }],
        });
      }
    });

  };

  const copyRecord = (recordIndex: number, recordId: string) => {
    const cellCollection = (view.columns as IViewColumn[]).reduce((total, cur, index) => {
      let value = Selectors.getCellValue(store.getState(), snapshot!, recordId, cur.fieldId);
      const fieldType = snapshot?.meta.fieldMap[cur.fieldId].type;
      if (fieldType === FieldType.Text && index === 0 && value) {
        value = [...value] as ISegment[];
      }
      total[cur.fieldId] = value;
      return total;
    }, {} as { [fieldId: string]: ICellValue });
    addRecords(recordIndex, 1, cellCollection ? [cellCollection] : undefined);
  };

  return {
    addRecords,
    setFieldAttr,
    setRecords,
    addField,
    setKanbanStyle,
    copyRecord,
  };
};
