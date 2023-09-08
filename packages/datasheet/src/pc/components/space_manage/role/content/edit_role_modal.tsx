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

import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Box, TextInput, Typography, useThemeColors } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { Modal } from 'pc/components/common/modal/modal/modal';

import styles from './style.module.less';

const MAX_NAME_LENGTH = 50;

interface IEditRoleModalProps {
  value: string;
  title: string;
  existed?: string[];
  onChange?: (value: string) => void;
  onCancel?: () => void;
}

const EditRoleModal: React.FC<React.PropsWithChildren<IEditRoleModalProps>> = (props) => {
  const { value, title, existed = [], onChange, onCancel } = props;
  const [input, setInput] = useState<string>(value);
  const [error, setError] = useState<string>();
  const colors = useThemeColors();
  const onOk = () => {
    if (!input) {
      setError(t(Strings.add_role_error_empty));
      return;
    }
    if (input.length > MAX_NAME_LENGTH) {
      setError(t(Strings.add_role_error_limit, { max: MAX_NAME_LENGTH }));
      return;
    }
    if (existed.some((v) => v === input)) {
      setError(t(Strings.add_role_error_exists));
      return;
    }
    onChange && onChange(input);
    onCancel && onCancel();
  };
  return (
    <Modal className={styles.editRoleModal} width={400} title={title} visible onOk={onOk} onCancel={onCancel} centered>
      <TextInput
        placeholder={t(Strings.role_name_input_placeholder)}
        onChange={(e) => {
          setInput(e.target.value);
          setError('');
        }}
        value={input}
        error={Boolean(error)}
        block
      />
      <Box position={'absolute'}>
        {error && (
          <Typography variant="body4" color={colors.textDangerDefault}>
            {error}
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export const expandEditRoleModal = (params: IEditRoleModalProps) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  const onModalClose = () => {
    root.unmount();
    container.parentElement!.removeChild(container);
  };

  root.render(<EditRoleModal {...params} onCancel={onModalClose} />);
};
