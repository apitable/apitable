import * as React from 'react';
import { MessageUI } from './components/message_ui';
import { IMessageType, IMessageUIProps } from './interface';
import { createUseMessage } from './components/use_message';

type IFuncMessageBase = Omit<IMessageUIProps, 'type'>;

const FuncMessageBase = createUseMessage();

const MessageTypes: IMessageType[] = ['success', 'default', 'warning', 'error'];

export const Message = MessageUI as IMessage;

MessageTypes.forEach(type =>
  Message[type] = (props: IFuncMessageBase) => {
    FuncMessageBase({ type, ...props });
  }
);

export type IMessage = React.FC<IFuncMessageBase> & 
  Record<
    IMessageType,
    (props: IFuncMessageBase) => void
  >;
