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

import { Tooltip } from 'antd';
import cls from 'classnames';
import { get } from 'lodash';
import { Typography, IconButton, useThemeColors } from '@apitable/components';
import { t, Strings } from '@apitable/core';
import { CloseOutlined } from '@apitable/icons';
import { serialize, ITextNode } from 'pc/components/draft_editor/utils';
import { useAppSelector } from 'pc/store/react-redux';
import styles from './style.module.less';

interface IReplyComment {
  reply: any;
  handleClose?: () => void;
  isStatic?: any;
}

export const ReplyComment = (props: IReplyComment) => {
  const colors = useThemeColors();
  const spaceInfo = useAppSelector((state) => state.space.curSpaceInfo);
  const { reply, handleClose, isStatic } = props;
  if (!reply) {
    return null;
  }
  const isDeleted = get(reply, 'isDeleted');
  if (isDeleted) {
    return (
      <div className={cls(styles.reply, { [styles.static]: isStatic })}>
        <Typography variant="body3">{t(Strings.comment_is_deleted)}</Typography>
      </div>
    );
  }
  // The old data is draft's data structure, so the method of getting the text content is different
  const blocks = get(reply, 'blocks');
  let text: string | JSX.Element = '';
  if (blocks) {
    // draft data format
    for (const block of blocks) {
      text += get(block, 'text') + ' ';
    }
  }
  if (!text) {
    // slate data format
    const _reply = Object.entries(reply)
      .filter(([k]) => !isNaN(Number(k)))
      .sort()
      .map(([, v]) => v);
    const _text = serialize(_reply as unknown as ITextNode[], spaceInfo);
    const isAllTextString = _text.every((t) => typeof t === 'string');
    if (isAllTextString) {
      text = _text
        .map((e) => (e === '' ? ' ' : e))
        .join('')
        .trim()
        .replaceAll(/\s+/g, ' ');
    } else {
      text = <>{_text.map((t) => (t === '' ? ' ' : t))}</>;
    }
  }
  return (
    <div className={cls(styles.reply, { [styles.static]: isStatic })}>
      <Tooltip
        title={
          <Typography variant="body3" ellipsis={{ rows: 8 }} color={colors.defaultBg}>
            {text}
          </Typography>
        }
      >
        <Typography variant="body3" ellipsis={{ rows: 1 }}>
          {text}
        </Typography>
      </Tooltip>
      {Boolean(handleClose) && (
        <IconButton
          icon={CloseOutlined}
          size="small"
          style={{
            width: '18px',
            height: '18px',
          }}
          onClick={handleClose}
        />
      )}
    </div>
  );
};
