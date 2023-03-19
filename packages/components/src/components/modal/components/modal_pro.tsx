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

export const ModalPro: FC<React.PropsWithChildren<IModalProProps>> = props => {

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
