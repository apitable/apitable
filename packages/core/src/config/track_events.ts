export enum TrackEvents {
  ButtonClick = 'ButtonClick',
  OpTransform = 'OpTransform',
  Operation = 'Operation',
  OldLocalChangeset = 'OldLocalChangeset',
  UpdateLog = 'UpdateLog',
  ViewsInfo = 'ViewsInfo',
  IntroVideoStart = 'IntroVideoStart',
  IntroVideoEnd = 'IntroVideoEnd',

  // 文件夹新手引导相关
  TaskListPush = 'TaskListPush', // 任务列表弹窗出现
  TaskListClick = 'TaskListClick', // 点击某个任务
  TaskListComplete = 'TaskListComplete', // 完成某个任务
  TaskListClose = 'TaskListClose', // 关闭任务列表弹窗

  Theme = 'Theme',
  Language = 'Language',
  RecordCard = 'RecordCard',
  // 模板中心搜索关键字上报
  TemplateKeyword = 'TemplateKeyword'
}
