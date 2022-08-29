import React, { FC } from 'react';
import { IModalProps } from '../interface';
import { Modal } from '../modal';
import { Box } from '../../box';
import { stopPropagation } from 'helper';

type Direction = 'row' | 'row-reverse';

interface IModalProProps extends IModalProps {
  direction?: Direction;
  optArea?: React.ReactElement;
}

export const ModalPro: FC<IModalProProps> = props => {

  const {
    direction = 'row-reverse',
    optArea,
  } = props;

  return (
    <Modal
      {...props}
      footer={null}
      closeIcon={null}
      modalRender={modal => (
        <Box>
          {optArea &&
            <Box
              display="flex"
              flexDirection={direction}
              onClick={stopPropagation}
            >
              <p>this is a paragraph</p>
            </Box>
          }
          {modal}
        </Box>
      )}
    >
      {props.children}
    </Modal>

  );
};
