import { useState } from 'react';
import * as React from 'react';
import RcTrigger, { TriggerProps } from 'rc-trigger';
import ArrowIcon from 'static/icon/common/mobile/tooltips_arrow.svg';
import style from './style.module.less';

type ITriggerProps = Omit<TriggerProps, 'popup'> & { content: TriggerProps['popup'] };

export const Popover: React.FC<ITriggerProps> = props => {
  const {
    content,
    ...rest
  } = props;

  const [visible, setVisible] = useState(false);

  return (
    <RcTrigger
      popupVisible={visible}
      onPopupVisibleChange={visible => setVisible(visible)}
      destroyPopupOnHide
      action={['click']}
      popupStyle={{
        position: 'absolute',
        zIndex: 1000,
        pointerEvents: 'initial',
      }}
      popupAlign={{
        points: ['tr', 'br'],
        offset: [6, 8],
      }}
      popup={
        <div
          className={style.toolsWrapper}
          onClick={() => setVisible(false)}
        >
          <div className={style.arrowWrapper}>
            <ArrowIcon fill={'#262838'} width={20} height={12} />
          </div>
          {content}
        </div>
      }
      {...rest}
    >
      {props.children}
    </RcTrigger>
  );
};

