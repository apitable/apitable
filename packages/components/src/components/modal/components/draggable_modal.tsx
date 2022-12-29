import React, { useState, useRef } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { IModalProps } from '../interface';
import { Modal } from '../modal';
import styled from 'styled-components';

const CustomTitle = styled.div`
  width: 100%;
  cursor: move;
`;

export const DraggableModal: React.FC<Omit<IModalProps, 'modelRender'>> = props => {

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
