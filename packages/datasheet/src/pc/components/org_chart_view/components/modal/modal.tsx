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

import { useClickAway, useMount } from 'ahooks';
import { useContext, useRef, useState } from 'react';
import * as React from 'react';
import { Typography, IconButton } from '@apitable/components';
import { t, Strings } from '@apitable/core';
import { ExpandOutlined } from '@apitable/icons';
import { useStoreState, useZoomPanHelper } from '@apitable/react-flow';
import { expandRecordIdNavigate } from 'pc/components/expand_record';
import { FieldEditor } from 'pc/components/expand_record/field_editor';
import { KeyCode } from 'pc/utils';
import { QUICK_ADD_MODAL_WIDTH, QUICK_ADD_MODAL_HEIGHT } from '../../constants';
import { FlowContext } from '../../context/flow_context';
import styles from './styles.module.less';

interface IModalProps {
  recordId?: string;
  setQuickAddRecId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const Modal: React.FC<React.PropsWithChildren<IModalProps>> = ({ recordId, setQuickAddRecId }) => {
  const { primaryFieldId, datasheetId, offsetLeft, offsetTop, orgChartViewStatus, bodySize, nodesMap } = useContext(FlowContext);

  const { settingPanelVisible, settingPanelWidth, rightPanelWidth, rightPanelVisible } = orgChartViewStatus;

  const [translateX, translateY, scale] = useStoreState((state) => state.transform);

  const { transform } = useZoomPanHelper();

  const [focusFieldId, setFocusFieldId] = useState<string | null>(primaryFieldId);

  const titleFieldRef = useRef(null);
  const mountRef = useRef(false);

  useClickAway(
    () => {
      if (mountRef.current) {
        setFocusFieldId(null);
      }
    },
    [titleFieldRef],
    'click',
  );

  const keyDownHandler = (e: React.KeyboardEvent) => {
    if (e.keyCode === KeyCode.Enter && !e.shiftKey) {
      setQuickAddRecId(undefined);
    }
  };

  const node = nodesMap[recordId!]!;
  const { x, y } = node.position;
  const { width, height } = node.data;
  const nodeLeft = x * scale + translateX + offsetLeft;
  const modalLeft = nodeLeft + width * scale + 8;
  const top = y * scale + translateY + offsetTop;
  const right = modalLeft + QUICK_ADD_MODAL_WIDTH + 32;

  const getOffsetX = () => {
    let boundRight = bodySize.width;

    if (settingPanelVisible) {
      boundRight = bodySize.width - settingPanelWidth;
    }

    if (rightPanelVisible) {
      boundRight = boundRight = bodySize.width - rightPanelWidth;
    }

    if (right > boundRight) {
      return right - boundRight;
    } else if (nodeLeft < offsetLeft) {
      return nodeLeft - offsetLeft - 32;
    }
    return 0;
  };

  // Just consider the lower boundary
  const getOffsetY = () => {
    return top + Math.max(QUICK_ADD_MODAL_HEIGHT, height * scale) + 32 - bodySize.height;
  };

  useMount(() => {
    const _offsetX = getOffsetX();
    const _offsetY = getOffsetY();
    transform({
      x: translateX - _offsetX,
      y: translateY - (_offsetY > 0 ? _offsetY : 0),
      zoom: scale,
    });
    setTimeout(() => {
      mountRef.current = true;
    });
  });

  if (!recordId || !node) return null;

  return (
    <div
      className={styles.modal}
      style={{
        left: modalLeft,
        top,
        width: QUICK_ADD_MODAL_WIDTH,
      }}
    >
      <header>
        <Typography variant="h7">{t(Strings.set_record)}</Typography>
        <IconButton icon={ExpandOutlined} onClick={() => expandRecordIdNavigate(recordId)} />
      </header>
      <div className={styles.content}>
        <div ref={titleFieldRef} onKeyDown={keyDownHandler}>
          <FieldEditor
            datasheetId={datasheetId}
            fieldId={primaryFieldId}
            expandRecordId={recordId}
            isFocus={focusFieldId === primaryFieldId}
            setFocus={setFocusFieldId}
          />
        </div>
      </div>
    </div>
  );
};
