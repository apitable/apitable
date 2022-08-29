import React from 'react';
import { Story } from '@storybook/react';
import { WarningTriangleNonzeroFilled } from '@vikadata/icons';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { StoryType } from '../../stories/constants';
import { Calendar } from './index';
import { ICalendar } from './interface';
import { Tooltip } from '../tooltip';
import { Drag, Drop } from './drag';

const COMPONENT_NAME = 'Calendar 日历';

const TITLE = `${StoryType.BaseComponent}/${COMPONENT_NAME}`;

export default {
  component: Calendar,
  title: TITLE,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/VjmhroWol6uCMqhDcJVrxV/LightMode?node-id=9109%3A10657',
    },
  },
};

const Template: Story<ICalendar> = (args) => <Calendar {...args} />;

export const Default = Template.bind({});
Default.args = {};
Default.parameters = {
  chromatic: { viewports: [375, 1000] },
};

export const Resizable = () => {
  const [tasks, setTasks] = React.useState([
    {
      id: 1,
      title: '吃饭 🍚',
      startDate: new Date('2021/07/08'),
      endDate: new Date('2021/07/15'),
    },
    {
      id: 2,
      title: '呵呵 🙂',
      startDate: new Date('2021/07/05'),
      endDate: new Date('2021/07/06'),
    },
    {
      id: 3,
      title: '喝水 🍧',
      startDate: new Date('2021/06/28'),
      endDate: new Date('2021/07/04'),
    },
    {
      id: 4,
      title: '睡觉 😴',
      startDate: new Date('2021/07/07'),
      endDate: new Date('2021/07/10'),
    }, 
    {
      id: 5,
      title: '学习 🙇',
      startDate: new Date('2021/07/05'),
      endDate: new Date('2021/07/13'),
    },
    {
      id: 6,
      title: '吃串串 🍡',
      startDate: new Date('2021/07/08'),
      endDate: new Date('2021/08/25'),
    },
    {
      id: 7,
      title: '看视频~~',
      startDate: new Date('2021/08/08'),
      endDate: new Date('2021/09/20'),
    },
  ]);
  const update = (id, startDate, endDate) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        return {
          ...t,
          startDate,
          endDate,
        };
      }
      return t;
    }));
  };
  return (
    <Calendar
      tasks={tasks}
      update={update}
      resizable
      defaultDate={new Date('2021/07/01')}
    />
  );
};

export const DraggableAndResizable = () => {
  const [tasks, setTasks] = React.useState([
    {
      id: 1,
      title: '吃饭 🍚',
      startDate: new Date('2021/07/08'),
      endDate: new Date('2021/07/15'),
    },
    {
      id: 2,
      title: '呵呵 🙂',
      startDate: new Date('2021/07/05'),
      endDate: new Date('2021/07/06'),
    },
    {
      id: 3,
      title: '喝水 🍧',
      startDate: new Date('2021/06/28'),
      endDate: new Date('2021/07/04'),
    },
    {
      id: 4,
      title: '睡觉 😴',
      startDate: new Date('2021/07/07'),
      endDate: new Date('2021/07/10'),
    }, 
    {
      id: 5,
      title: '学习 🙇',
      startDate: new Date('2021/07/05'),
      endDate: new Date('2021/07/13'),
    },
    {
      id: 6,
      title: '吃串串 🍡',
      startDate: new Date('2021/07/08'),
      endDate: new Date('2021/08/25'),
    },
    {
      id: 7,
      title: '看视频~~',
      startDate: new Date('2021/08/08'),
      endDate: new Date('2021/09/20'),
    },
  ]);
  const update = (id, startDate, endDate) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        return {
          ...t,
          startDate,
          endDate,
        };
      }
      return t;
    }));
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <Calendar
        dnd={[Drag, Drop]}
        tasks={tasks}
        update={update}
        resizable
        defaultDate={new Date('2021/07/01')}
      />
    </DndProvider>
  );
};

export const DisabledTask = Template.bind({});

DisabledTask.args = {
  tasks: [{
    id: 1,
    title: '干饭 🍚',
    startDate: new Date('2021/07/14'),
    endDate: new Date('2021/07/20'),
  }],
  defaultDate: new Date('2021/07/01'),
  disabled: true,
};

export const WarningTask = Template.bind({});

WarningTask.args = {
  tasks: [{
    id: 1,
    title: '干饭 🍚',
    startDate: new Date('2021/07/15'),
    endDate: new Date('2021/07/06'),
  }],
  defaultDate: new Date('2021/07/01'),
  warnText: (
    <Tooltip content="结束日期小于开始日期">
      <span className="warning">
        <WarningTriangleNonzeroFilled size={14} color="#FFAB00"/>
      </span>
    </Tooltip>
  )
};

export const SetTaskStyle = Template.bind({});
SetTaskStyle.args = {
  tasks: [{
    id: 1,
    title: '干饭 🍚',
    startDate: new Date('2021/07/15'),
    endDate: new Date('2021/07/19'),
  },{
    id: 2,
    title: '睡觉 😴',
    startDate: new Date('2021/07/17'),
    endDate: new Date('2021/07/17'),
  }],
  defaultDate: new Date('2021/07/01'),
  listStyle: {
    border: '1px dashed #AB45FB',
    lineHeight: '60px',
    height: '60px'
  }
};
SetTaskStyle.parameters = {
  chromatic: { viewports: [375, 1000] },
};