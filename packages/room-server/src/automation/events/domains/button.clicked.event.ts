import { IEventInstance, IOPEvent } from '@apitable/core';

export type ButtonClickedEvent = Omit<IEventInstance<IOPEvent>, 'context'> & {
  context: ButtonClickedEventContext;
} & {
  beforeApply: boolean;
};

export type ButtonClickedEventContext = {
  triggerId: string,
  datasheetId: string,
  recordId: string,
  datasheetName: string,
  recordUrl: string,
  // member name
  clickedBy: string,
  [key: string]: any,
};
