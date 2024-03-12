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

import Image from 'next/image';
import * as React from 'react';
import { FC, useContext } from 'react';
import { Button, Typography, ThemeName } from '@apitable/components';
import { integrateCdnHost, Settings, Strings, t } from '@apitable/core';
import { AddOutlined } from '@apitable/icons';
import { OnLoadParams, useStoreState } from '@apitable/react-flow';
import { useAppSelector } from 'pc/store/react-redux';
import ArchitectureEmptyDark from 'static/icon/datasheet/architecture_empty_dark.png';
import ArchitectureEmptyLight from 'static/icon/datasheet/architecture_empty_light.png';
import { CARD_WIDTH } from '../../constants';
import { FlowContext } from '../../context/flow_context';
import { NodeHandleState } from '../../interfaces';
import styles from './styles.module.less';

interface IAddFirstNodeProps {
  mode: 'none' | 'add';
  onAdd: () => Promise<string>;
  reactFlowInstance: React.MutableRefObject<OnLoadParams<any> | undefined>;
}

export const AddFirstNode: FC<React.PropsWithChildren<IAddFirstNodeProps>> = (props) => {
  const { mode, onAdd, reactFlowInstance } = props;

  const {
    bodySize,
    offsetLeft,
    offsetTop,
    setNodeStateMap,
    getCardHeight,
    orgChartViewStatus: { rightPanelVisible },
  } = useContext(FlowContext);

  const [, , scale] = useStoreState((state) => state.transform);

  const addMode = mode === 'add';
  console.log('addMode', addMode);
  const themeName = useAppSelector((state) => state.theme);
  const architectureEmpty = themeName === ThemeName.Light ? ArchitectureEmptyLight : ArchitectureEmptyDark;

  return (
    <div className={styles.wrapper}>
      <div className={styles.addFirstNode}>
        <div className={styles.imgWrapper}>
          <Image
            style={{
              width: 232,
              margin: 'auto',
            }}
            src={addMode ? integrateCdnHost(Settings.view_architecture_empty_record_list_img.value) : architectureEmpty}
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
          {addMode
            ? t(Strings.org_chart_please_click_button_to_create_a_node)
            : !rightPanelVisible
              ? t(Strings.org_chart_please_drag_a_node_into_canvas_if_list_closed)
              : t(Strings.org_chart_please_drag_a_node_into_canvas)}
        </Typography>
        {addMode && (
          <div
            style={{
              zIndex: 10,
              width: 188,
            }}
          >
            <Button
              prefixIcon={<AddOutlined />}
              color="primary"
              onClick={async () => {
                const id = await onAdd();
                const position = reactFlowInstance.current!.project({
                  x: bodySize.width / 2 - offsetLeft - (CARD_WIDTH * scale) / 2,
                  y: bodySize.height / 2 - offsetTop - (getCardHeight(id) * scale) / 2,
                });
                setNodeStateMap((s) => ({
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
