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

import React, { useContext, useState } from 'react';
import { Popover } from 'antd';
import { FixedSizeList as List } from 'react-window';
import { LinkButton } from '../../link_button';
import { Typography } from '../../typography';
import { IconButton } from '../../icon_button';
import { NarrowOutlined, CloseOutlined } from '@apitable/icons';
import { MoreDiv, MoreListDiv, MoreHeader, DrawerStyled, ListItemStyled } from './styled';
import { CalendarContext } from '../calendar_context';
import { MAX_LEVEL } from '../constants';
import { formatDayValue } from '../utils';
import { Task } from './task';
import { Strings, t } from '@apitable/core';

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
  const { listHeight, defaultListHeight, space, isMobile, moreText } = useContext(CalendarContext);
  const [visible, setVisible] = useState(false);

  const detailWeeks: string[] = JSON.parse(t(Strings.calendar_const_detail_weeks)) || [];
  const title = (
    <Typography variant="h6">
      {formatDayValue(curDay.month, curDay.day)}
      <MoreHeader>
        {detailWeeks[mIndex]}
      </MoreHeader>
    </Typography>
  );
  const tasksLength = moreTasks.length;
  const itemHeight = listHeight + 22 + (isMobile ? 8 : 4);
  const _List = List as any;
  const moreList = (
    <MoreListDiv isMobile={isMobile}>
      <_List
        height={Math.min(500, tasksLength * itemHeight)}
        width="100%"
        itemCount={tasksLength}
        itemSize={itemHeight}
        className="moreList"
      >
        {({ index, style }: any) => {
          return (
            <ListItemStyled style={style}>
              <Task key={index} levelItem={moreTasks[index]} isMore />
            </ListItemStyled>
          );
        }}
      </_List>
    </MoreListDiv>
  );
  if (isMobile && visible) {
    return (
      <DrawerStyled
        closeIcon={<IconButton icon={CloseOutlined} />}
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
            <IconButton icon={NarrowOutlined} onClick={() => setVisible(false)} />
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