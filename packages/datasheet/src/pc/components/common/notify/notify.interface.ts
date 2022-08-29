export enum NotifyKey {
  // 导出
  Export = 'export',
  // 复制粘贴
  Paste = 'paste',
  // 删除记录
  DeleteRecord = 'deleteRecord',
  // 撤销重做
  Undo = 'undo',
  // clear Record data
  ClearRecordData = 'clearRecordData',
  // 删除字段
  DeleteField = 'deleteField',
  // 删除一个选项
  DeleteOption = 'deleteOption',
  // 修改选项名
  ChangeOptionName = 'changeOptionName',
  // 新增维格列
  AddField = 'addField',
  // 修改维格列配置
  ChangeFieldSetting = 'changeFieldSetting',
  // 插入维格列
  InsertField = 'insetField',
  // 复制维格列
  DuplicateField = 'DuplicateField',
  // 填充数据
  FillCell = 'fillCell',
  // 删除看板视图的分组
  DeleteKanbanGroup = 'deleteKanbanGroup',
  // 时光机回滚
  Rollback = 'rollback',
}

export interface ICustomNotifyConfig {
  // 按钮的文案内容
  btnText: string;
  // 点击按钮后的回调
  btnFn(): void;
  // 约束对 key 的定义
  key: NotifyKey;
  // 指定notify挂载的dom
  dom?: HTMLElement | null;
}
