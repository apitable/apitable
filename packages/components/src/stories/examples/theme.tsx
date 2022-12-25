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

import React, { useState } from 'react';
import { defaultTheme, darkTheme, ThemeProvider, Button, ThemeName } from '../../index';
import { Select } from '../../components/select';
import { Typography } from '../../components/typography';
import { Box } from '../../components/box';
import { Switch } from '../../components/switch';
import { TextInput } from '../../components/text_input';
import { TextButton } from '../../components/text_button';
import { Radio, RadioGroup } from '../../components/radio';
import { Skeleton } from '../../components/skeleton';
import { List } from '../../components/list';
import { Pagination } from '../../components/pagination';

export const ThemeExample = () => {
  const [theme, setTheme] = useState(ThemeName.Light);
  const selectedTheme = theme.includes(ThemeName.Light) ? defaultTheme : darkTheme;
  
  return (
    <ThemeProvider theme={selectedTheme}>
      <Box backgroundColor={selectedTheme.color.defaultBg} padding={16}>
        <Typography variant="h4">
          Select theme
        </Typography>
        <Select
          options={[
            { label: 'Default theme', value: ThemeName.Light },
            { label: 'Dark theme', value: ThemeName.Dark },
          ]}
          value={theme}
          onSelected={(option) => {
            setTheme(option.value as ThemeName);
          }}
          dropdownMatchSelectWidth={false}
          triggerStyle={{ width: 100 }}
        />
        <Button>Button</Button>
        <Button color="primary"> Fill Button </Button>
        <Button variant="jelly">Jelly Button </Button>
        <Button variant="jelly" color="primary">Jelly Primary Button </Button>
        <TextButton>TextButton</TextButton>
        <TextInput placeholder="please enter" />
        <Switch />
        <br />
        <RadioGroup name="btn-group" isBtn>
          <Radio value="1">option 1</Radio>
          <Radio disabled value="2">option 2</Radio>
          <Radio value="3">option 3</Radio>
        </RadioGroup>
        <br />
        <br />
        <List
          bordered
          data={['list 1', 'list 2', 'list 3', 'list 4', 'list 5']}
          footer={<div>Footer</div>}
          header={<div>Header</div>}
        />
        <br />
        <Skeleton
          count={3}
          height="68px"
          type="text"
          circle={false}
          style={{
            marginBottom: 16,
          }}
        />
        <Pagination total={191} showQuickJump showTotal showChangeSize />
      </Box>
    </ThemeProvider>
  );
};