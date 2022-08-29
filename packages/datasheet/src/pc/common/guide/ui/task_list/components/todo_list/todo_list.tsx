import { FC } from 'react';
import * as React from 'react';
import styles from './style.module.less';
import classNames from 'classnames';
import { CheckOutlined } from '@vikadata/icons';
import { blackBlue, deepPurple } from '@vikadata/components';

export enum TodoState {
  Empty = 'Empty',
  Active = 'Active',
  Done = 'Done',
}

export interface ITodoItem {
  text: string,
  stopEvents?: string[], // 对指定的 todo item 添加阻止默认事件
  state: TodoState,
}

interface IProps {
  list: ITodoItem[],
  goAndReset: (index: number) => void;
}

const Radio: FC<{state: TodoState}> = ({ state }) => {
  if (state === TodoState.Empty) {
    return (
      <div className={styles.radio} style={{ borderColor: blackBlue[200] }} />
    );
  }
  if (state === TodoState.Active) {
    return (
      <div className={styles.radio} style={{ borderColor: deepPurple[500] }} />
    ); 
  }
  if (state === TodoState.Done) {
    return (
      <div className={styles.radio} style={{ borderColor: deepPurple[500], backgroundColor: deepPurple[500] }}>
        <div style={{ transform: 'scale(1.2)' }}>
          <CheckOutlined color='#fff' size={17} />
        </div>
      </div>
    ); 
  }
  return null;
};

const stopEvent = (e: React.UIEvent) => {
  e.preventDefault();
};

export const TodoList: FC<IProps> = (props) => {
  return (
    <div>
      {
        props.list.map((item, index) => {
          const stopEventList = (item.stopEvents || []).reduce((events, e) => {
            events[e] = stopEvent;
            return events;
          }, {});
          return (
            <div 
              className={styles.item} 
              key={index}
              {...stopEventList}
              onClick={() => { item.state !== TodoState.Active && props.goAndReset(index); }}
            >
              <Radio state={item.state} />
              <div 
                className={
                  classNames(styles.text, {
                    [styles.active]: item.state === TodoState.Active,
                    [styles.done]: item.state === TodoState.Done,
                  })
                }
              >
                {item.text}
              </div> 
            </div>
          );
        })
      }
    </div>
  );
};
