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
          选择主题
        </Typography>
        <Select
          options={[
            { label: '默认主题', value: ThemeName.Light },
            { label: '暗黑主题', value: ThemeName.Dark },
          ]}
          value={theme}
          onSelected={(option) => {
            setTheme(option.value as ThemeName);
          }}
          dropdownMatchSelectWidth={false}
          triggerStyle={{ width: 100 }}
        />
        <Button>按钮</Button>
        <Button color="primary"> 默认 fill Button </Button>
        <Button variant="jelly">果冻 Button </Button>
        <Button variant="jelly" color="primary">果冻 Primary Button </Button>
        <TextButton>TextButton</TextButton>
        <TextInput placeholder="请输入内容" />
        <Switch />
        <br />
        <RadioGroup name="btn-group" isBtn>
          <Radio value="1">单选 1</Radio>
          <Radio disabled value="2">单选 2</Radio>
          <Radio value="3">单选 3</Radio>
        </RadioGroup>
        <br />
        <br />
        <List
          bordered
          data={['列表 1', '列表 2', '列表 3', '列表 4', '列表 5']}
          footer={<div>尾部</div>}
          header={<div>头部</div>}
        />
        <br />
        <Skeleton
          count={3}
          duration={3}
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