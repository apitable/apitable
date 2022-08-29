import { useContext, useRef, useState } from 'react';
import * as React from 'react';
import { t, Strings } from '@vikadata/core';
import { ExpandRecordOutlined } from '@vikadata/icons';
import { Typography, IconButton } from '@vikadata/components';
import { FieldEditor } from 'pc/components/expand_record/field_editor';
import { expandRecordIdNavigate } from 'pc/components/expand_record';
import { useClickAway, useMount } from 'ahooks';
import styles from './styles.module.less';
import { FlowContext } from '../../context/flow_context';
import { useStoreState, useZoomPanHelper } from '@vikadata/react-flow-renderer';
import { QUICK_ADD_MODAL_WIDTH, QUICK_ADD_MODAL_HEIGHT } from '../../constants';

interface IModalProps {
  recordId?: string;
}

export const Modal: React.FC<IModalProps> = ({
  recordId,
}) => {

  const {
    primaryFieldId,
    datasheetId,
    offsetLeft,
    offsetTop,
    orgChartViewStatus,
    bodySize,
    nodesMap,
  } = useContext(FlowContext);

  const {
    settingPanelVisible,
    settingPanelWidth,
    rightPanelWidth,
    rightPanelVisible,
  } = orgChartViewStatus;

  const [translateX, translateY, scale] = useStoreState(state => state.transform);

  const {
    transform
  } = useZoomPanHelper();

  const [focusFieldId, setFocusFieldId] = useState<string | null>(primaryFieldId);

  const titleFieldRef = useRef(null);

  useClickAway(() => {
    setFocusFieldId(null);
  }, [titleFieldRef]);

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

  // 只用考虑下边界
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
  });

  if (!recordId || !node) return null;

  return (
    <div
      className={styles.modal}
      style={{
        left: modalLeft,
        top,
        width: QUICK_ADD_MODAL_WIDTH,
        height: QUICK_ADD_MODAL_HEIGHT,
      }}
    >
      <header>
        <Typography variant="h7">
          {t(Strings.set_record)}
        </Typography>
        <IconButton icon={ExpandRecordOutlined} onClick={() => expandRecordIdNavigate(recordId)} />
      </header>
      <div className={styles.content}>
        <div ref={titleFieldRef}>
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
