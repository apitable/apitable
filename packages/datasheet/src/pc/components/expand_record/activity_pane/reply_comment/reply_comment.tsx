import { Tooltip } from 'antd';
import { t, Strings } from '@apitable/core';
import { Typography, IconButton, useThemeColors } from '@vikadata/components';
import { LabelSmallOutlined } from '@vikadata/icons';
import { get } from 'lodash';
import cls from 'classnames';
import styles from './style.module.less';
import { serialize, ITextNode } from 'pc/components/draft_editor/utils';
import { useSelector } from 'react-redux';

interface IReplyComment {
  reply: any;
  handleClose?: () => void;
  isStatic?: any;
}

export const ReplyComment = (props: IReplyComment) => {
  const colors = useThemeColors();
  const spaceInfo = useSelector(state => state.space.curSpaceInfo);
  const { reply, handleClose, isStatic } = props;
  if (!reply) {
    return null;
  }
  const isDeleted = get(reply, 'isDeleted');
  if (isDeleted) {
    return (
      <div className={cls(styles.reply, { [styles.static]: isStatic })}>
        <Typography variant="body3">
          {t(Strings.comment_is_deleted)}
        </Typography>
      </div>
    );
  }
  // The old data is draft's data structure, so the method of getting the text content is different
  const blocks= get(reply, 'blocks');
  let text: string | JSX.Element = '';
  if (blocks) { // draft data format
    for (const block of blocks) {
      text += get(block, 'text') + ' ';
    }
  }
  if (!text) { // slate data format
    const _reply = Object.entries(reply).filter(([k, v]) => !isNaN(Number(k))).sort().map(([k, v]) => v);
    const _text = serialize(_reply as unknown as ITextNode[], spaceInfo);
    const isAllTextString = _text.every(t => typeof t === 'string');
    if (isAllTextString) {
      text = _text.map(e=> e === '' ? ' ': e).join('').trim().replaceAll(/\s+/g, ' ');
    } else { 
      text = (
        <>
          {_text.map(t => t === '' ? ' ': t)}
        </>
      );
    }
  }
  return (
    <div className={cls(styles.reply, { [styles.static]: isStatic })}>
      <Tooltip
        title={(
          <Typography variant="body3" ellipsis={{ rows: 8 }} color={colors.defaultBg}>
            {text}
          </Typography>
        )}
      >
        <Typography variant="body3" ellipsis={{ rows: 1 }}>
          {text}
        </Typography>
      </Tooltip>
      {Boolean(handleClose) && (
        <IconButton
          icon={LabelSmallOutlined}
          size="small"
          style={{
            width: '18px',
            height: '18px'
          }}
          onClick={handleClose}
        />
      )}
    </div>
  );
};
