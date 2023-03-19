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

import React, { useState, useRef } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { IModalProps } from '../interface';
import { Modal } from '../modal';
import styled from 'styled-components';

const CustomTitle = styled.div`
  width: 100%;
  cursor: move;
`;

export const DraggableModal: React.FC<React.PropsWithChildren<Omit<IModalProps, 'modelRender'>>> = props => {

  const [disabled, setDisabled] = useState(false);

  const boundsRef = useRef<{
    left: number;
    top: number;
    bottom: number;
    right: number;
  }>({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  });

  const draggleRef = useRef<HTMLDivElement>(null);

  const onStart = (event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const targetRect = draggleRef?.current?.getBoundingClientRect();
    boundsRef.current = {
      left: -targetRect?.left! + uiData?.x,
      right: clientWidth - (targetRect?.right! - uiData?.x),
      top: -targetRect?.top! + uiData?.y,
      bottom: clientHeight - (targetRect?.bottom! - uiData?.y),
    };
  };

  return (
    <Modal
      {...props}
      title={(
        <CustomTitle
          onMouseOver={() => disabled && setDisabled(false)}
          onMouseOut={() => setDisabled(true)}
          onFocus={() => { }}
          onBlur={() => { }}
        >
          Draggable Modal
        </CustomTitle>
      )}

      modalRender={modal => (
        <Draggable
          disabled={disabled}
          bounds={boundsRef.current}
          onStart={(event, uiData) => onStart(event, uiData)}
        >
          <div ref={draggleRef}>{modal}</div>
        </Draggable>
      )}
    >
      {props.children}
    </Modal>
  );
};
