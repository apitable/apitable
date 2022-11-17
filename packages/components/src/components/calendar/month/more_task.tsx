import React, { useContext, useState } from 'react';
import { Popover } from 'antd';
import { FixedSizeList as List } from 'react-window';
import { LinkButton } from '../../link_button';
import { Typography } from '../../typography';
import { IconButton } from '../../icon_button';
import { NarrowRecordOutlined, CloseMiddleOutlined } from '@apitable/icons';
import { MoreDiv, MoreListDiv, MoreHeader, DrawerStyled, ListItemStyled } from './styled';
import { CalendarContext } from '../calendar_context';
import { DETAIL_WEEKS, MAX_LEVEL } from '../constants';
import { formatDayValue } from '../utils';
import { Task } from './task';

interface IMoreTask {
  mIndex: number;
  curDay: {
    day: number;
    month: number;
  };
  moreTasks: any[];
  takeLevelLen: number;
}

export const MoreTask = (props: IMoreTask) => {
  const { mIndex, curDay, moreTasks, takeLevelLen } = props;
  const { lang, listHeight, defaultListHeight, space, isMobile, moreText } = useContext(CalendarContext);
  const [visible, setVisible] = useState(false);
  const title = (
    <Typography variant="h6">
      {formatDayValue(curDay.month, curDay.day, lang)}
      <MoreHeader>
        {DETAIL_WEEKS[lang][mIndex]}
      </MoreHeader>
    </Typography>
  );
  const tasksLength = moreTasks.length;
  const itemHeight = listHeight + 22 + (isMobile ? 8 : 4);
  const moreList = (
    <MoreListDiv isMobile={isMobile}>
      <List
        height={Math.min(500, tasksLength * itemHeight)}
        width="100%"
        itemCount={tasksLength}
        itemSize={itemHeight}
        className="moreList"
      >
        {({ index, style }) => {
          return (
            <ListItemStyled style={style}>
              <Task key={index} levelItem={moreTasks[index]} isMore />
            </ListItemStyled>
          );
        }}
      </List>
    </MoreListDiv>
  );
  if (isMobile && visible) {
    return (
      <DrawerStyled
        closeIcon={<IconButton icon={CloseMiddleOutlined} />}
        push={{ distance: 0 }}
        visible={visible}
        placement="bottom"
        height="auto"
        className="taskMobileModal"
        onClose={() => setVisible(false)}
        title={title}
      >
        {moreList}
      </DrawerStyled>
    );
  }
  return (
    <Popover
      key={mIndex}
      trigger={['click']}
      visible={visible}
      overlayClassName="taskModal"
      destroyTooltipOnHide
      overlayStyle={{
        zIndex: 15,
        padding: 0,
      }}
      onVisibleChange={(visibleStatus) => {
        setVisible(visibleStatus);
      }}
      content={(
        <MoreDiv>
          <header>
            {title}
            <IconButton icon={NarrowRecordOutlined} onClick={() => setVisible(false)} />
          </header>
          {moreList}
        </MoreDiv>
      )}
    >
      <LinkButton
        underline={false}
        className="moreTask"
        style={{
          position: 'absolute',
          zIndex: 1,
          top: Math.min(MAX_LEVEL, takeLevelLen) * (listHeight + space) + defaultListHeight + 4 + 'px',
          left: mIndex * (100 / 7) + '%',
          width: (100 / 7) + '%',
        }}
      >
        {moreText}
      </LinkButton>
    </Popover>
  );
};