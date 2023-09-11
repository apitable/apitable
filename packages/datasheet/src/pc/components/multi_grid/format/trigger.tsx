/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { useClickAway } from 'ahooks';
import Trigger, { TriggerProps as RcTriggerProps } from 'rc-trigger';
import * as React from 'react';
import { memo, useRef } from 'react';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Popup } from 'pc/components/common/mobile/popup';

interface ITriggerProps extends Partial<RcTriggerProps> {
  trigger: React.ReactNode;
  popup: React.ReactNode;
  showPopup: boolean;
  action?: string[];
  popupVisibleCheck?: (value: boolean) => boolean;
  setShowPopup(value: boolean): void;
  popupStyle?: React.CSSProperties;
}

export const MyTrigger: React.FC<React.PropsWithChildren<ITriggerProps>> = memo((props: ITriggerProps) => {
  const { showPopup, setShowPopup, trigger, popup, popupVisibleCheck, action = ['click'], popupStyle, ...rest } = props;
  const triggerSelfRef = useRef<any>(null);
  const triggerRef = useRef(null);
  const ref = useRef(null);

  useClickAway((event: any) => {
    if (triggerRef.current && (triggerRef.current! as any).contains(event.target)) {
      return;
    }
    triggerSelfRef.current!.close();
  }, ref);

  return (
    <>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <Trigger
          action={action}
          mouseLeaveDelay={0.1}
          popup={<div ref={ref}>{popup}</div>}
          destroyPopupOnHide
          // alignPoint
          forceRender
          onPopupVisibleChange={(value: boolean) => {
            const isShow = popupVisibleCheck ? popupVisibleCheck(value) : true;
            isShow && setShowPopup(value);
          }}
          defaultPopupVisible={false}
          popupVisible={showPopup}
          popupAlign={{
            points: ['tl', 'tr'],
            offset: [20, 0],
            overflow: {
              adjustX: true,
              adjustY: true,
              // alwaysByViewport: true,
            },
            useCssRight: true,
            useCssBottom: true,
            useCssTransform: true,
          }}
          popupStyle={{
            width: 288,
            // zIndex: 101,
            ...popupStyle,
          }}
          ref={triggerSelfRef}
          {...rest}
        >
          <div ref={triggerRef}>{trigger}</div>
        </Trigger>
      </ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <Popup open={showPopup} onClose={() => setShowPopup(false)} bodyStyle={{ padding: 0 }} height="90%">
          {popup}
        </Popup>
        <div onClick={() => setShowPopup(true)}>{trigger}</div>
      </ComponentDisplay>
    </>
  );
});
