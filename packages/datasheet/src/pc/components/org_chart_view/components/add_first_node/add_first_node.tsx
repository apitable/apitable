import { Button, Typography } from '@vikadata/components';
import { integrateCdnHost, Settings, Strings, t } from '@apitable/core';
import { AddOutlined } from '@vikadata/icons';
import { OnLoadParams, useStoreState } from '@vikadata/react-flow-renderer';
import Image from 'next/image';
import * as React from 'react';
import { FC, useContext } from 'react';
import { CARD_WIDTH } from '../../constants';
import { FlowContext } from '../../context/flow_context';
import { NodeHandleState } from '../../interfaces';
import styles from './styles.module.less';

interface IAddFirstNodeProps {
  mode: 'none' | 'add';
  onAdd: () => string;
  reactFlowInstance: React.MutableRefObject<OnLoadParams<any> | undefined>;
}

export const AddFirstNode: FC<IAddFirstNodeProps> = props => {

  const {
    mode,
    onAdd,
    reactFlowInstance,
  } = props;

  const {
    bodySize,
    offsetLeft,
    offsetTop,
    setNodeStateMap,
    getCardHeight,
    orgChartViewStatus: { rightPanelVisible },
  } = useContext(FlowContext);

  const [,,scale] = useStoreState(state => state.transform);

  const addMode = mode === 'add';

  return (
    <div className={styles.wrapper}>
      <div className={styles.addFirstNode} >
        <div className={styles.imgWrapper}>
          <Image
            style={{
              width: 232,
              margin: 'auto'
            }}
            src={
              addMode
                ? integrateCdnHost(Settings.org_guide_add_first_node_cover_1.value)
                : integrateCdnHost(Settings.org_guide_add_first_node_cover_2.value)
            }
            width={232}
            height={176}
            alt={''}
          />
        </div>

        <Typography
          variant="body3"
          style={{
            marginBottom: 24,
          }}
        >
          {
            addMode
              ? t(Strings.org_chart_please_click_button_to_create_a_node)
              : (!rightPanelVisible
                ? t(Strings.org_chart_please_drag_a_node_into_canvas_if_list_closed)
                : t(Strings.org_chart_please_drag_a_node_into_canvas))
          }
        </Typography>
        {addMode && (
          <div
            style={{
              zIndex: 10,
              width: 188
            }}
          >
            <Button
              prefixIcon={<AddOutlined />}
              color='primary'
              onClick={() => {
                const id = onAdd();
                const position = reactFlowInstance.current!.project({
                  x: bodySize.width / 2 - offsetLeft - CARD_WIDTH * scale / 2,
                  y: bodySize.height / 2 - offsetTop - getCardHeight(id) * scale / 2,
                });
                setNodeStateMap(s => ({
                  ...s,
                  [id]: {
                    ...s?.[id],
                    handleState: NodeHandleState.Handling,
                    position,
                  },
                }));
              }}
              block
            >
              {t(Strings.add_record)}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
