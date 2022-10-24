import { CSSMotionList } from 'rc-motion';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { IMessageUIProps } from '../interface';
import { MessageUI } from './message_ui';

export function useRefCallback<T extends(...args: any[]) => any>(callback: T) {
  const callbackRef = React.useRef(callback);
  callbackRef.current = callback;
  return React.useCallback((...args: any[]) => callbackRef.current(...args), []) as T;
}

let seed = 0;
const now = Date.now();

const getUuid = () => {
  const id = seed;
  seed += 1;
  return `vika-message_${now}_${id}`;
};
// const uiPropsMap: Record<React.Key,IMessageUIProps> = {}

const MessageUiContainer = (props: IMessageUIProps) => {
  const [uuids, setUuids] = useState<React.Key[]>([]);
  const [uiPropsMap, setUiPropsMap] = useState<Record<React.Key, IMessageUIProps>>({});
  // const remove = useRefCallback((removeKey: React.Key) => {
  //   setUuids(uuids.filter(key => key !== removeKey));
  //   console.log(uiPropsMap)
  // });
  const remove = (removeKey: React.Key) => {
    setUuids(uuids => uuids.filter(key => key !== removeKey));
  };

  useEffect(() => {
    if (props.messageKey && uiPropsMap.hasOwnProperty(props.messageKey)) {
      if (uuids.includes(props.messageKey)) {
        // 组件正在渲染，更新内容
        setUiPropsMap({
          ...uiPropsMap,
          [props.messageKey]: {
            ...uiPropsMap[props.messageKey],
            ...props,
          },
        });
        return;
      }
    }
    // 组件首次渲染
    const key = props.messageKey || getUuid();
    const newUuids = [...uuids];
    newUuids.push(key);
    setUuids(newUuids);
    setUiPropsMap({
      ...uiPropsMap,
      [key]: {
        ...props,
        messageKey: key,
        onDestroy: () => remove(key),
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return (
    <div style={{ position: 'fixed', top: '80px', textAlign: 'center', width: '100%', pointerEvents: 'none' }}>
      <CSSMotionList keys={uuids} motionName='vika'>
        {({ key, className: motionClassName }) =>
          <MessageUI
            motionClassName={motionClassName}
            {...uiPropsMap[key]}
          />
        }
      </CSSMotionList>
    </div>
  );
};

export const createUseMessage = () => {
  let domWrapper: HTMLDivElement | null = null;
  const useMessage = (props: IMessageUIProps) => {
    if (!domWrapper) {
      const rootDom = document.createElement('div');
      document.body.appendChild(rootDom);
      domWrapper = rootDom;
    }
    const root = createRoot(domWrapper);
    root.render(
      <MessageUiContainer {...props} messageKey={props.messageKey} />);
  };

  return useMessage;
};

