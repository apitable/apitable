export enum TrackEvents {
  ButtonClick = 'ButtonClick',
  OpTransform = 'OpTransform',
  Operation = 'Operation',
  OldLocalChangeset = 'OldLocalChangeset',
  UpdateLog = 'UpdateLog',
  ViewsInfo = 'ViewsInfo',
  IntroVideoStart = 'IntroVideoStart',
  IntroVideoEnd = 'IntroVideoEnd',
  // Folder novice guide related
  TaskListPush = 'TaskListPush', // The task list popup window appears
  TaskListClick = 'TaskListClick', // click on a task
  TaskListComplete = 'TaskListComplete', // complete a task
  TaskListClose = 'TaskListClose', // close the task list popup

  Theme = 'Theme',
  Language = 'Language',
  RecordCard = 'RecordCard',
  // Template center search keyword report
  TemplateKeyword = 'TemplateKeyword',
}
