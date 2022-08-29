import React from 'react';
import { AutosaveOutlined, LockNonzeroOutlined, CalenderRightOutlined } from '@vikadata/icons';
import { black } from 'colors';
import { Switch } from '../switch';
import { ContextMenu, useContextMenu } from './index';
import { StoryType } from '../../stories/constants';

const COMPONENT_NAME = 'ContextMenu 右键菜单';

const TITLE = `${StoryType.BaseComponent}/${COMPONENT_NAME}`;

export default {
  component: ContextMenu,
  title: TITLE,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/VjmhroWol6uCMqhDcJVrxV/LightMode?node-id=247%3A0',
    },
  },
};

export const Default = () => {
  const { contextMenu, onSetContextMenu } = useContextMenu();

  return (
    <div>
      <button
        onContextMenu={(e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();
          onSetContextMenu(e);
        }}
      >
        右击我
      </button>
      <ContextMenu contextMenu={contextMenu}>
        <div style={{ background: '#fff', boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)', padding: 10 }}>I' m a child</div>
      </ContextMenu>
    </div>
  );
};

export const OverlayContextMenu = () => {
  const { contextMenu, onSetContextMenu } = useContextMenu();

  return (
    <div>
      <button
        onContextMenu={(e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();
          onSetContextMenu(e);
        }}
      >
        右击我
      </button>
      <ContextMenu
        contextMenu={contextMenu}
        overlay={[{
          key: '1-1',
          label: '一级菜单',
        }, {
          key: '1-2',
          label: '一级菜单',
        }, {
          key: '1-3',
          label: '一级菜单',
        }]}
      />
    </div>
  );
};

export const WidthContextMenu = () => {
  const { contextMenu, onSetContextMenu } = useContextMenu();

  return (
    <div>
      <button
        onContextMenu={(e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();
          onSetContextMenu(e);
        }}
      >
        右击我
      </button>
      <ContextMenu
        contextMenu={contextMenu}
        width={500}
        overlay={[{
          key: '1-1',
          label: '一级菜单',
          children: [{
            key: '1-1-1',
            label: '二级菜单',
          }]
        }]}
      />
    </div>
  );
};

export const CascadeContextMenu = () => {
  const { contextMenu, onSetContextMenu } = useContextMenu();

  return (
    <div>
      <button
        onContextMenu={(e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();
          onSetContextMenu(e);
        }}
        style={{ position: 'fixed', left: 0 }}
      >
        右击我
      </button>
      <ContextMenu
        contextMenu={contextMenu}
        overlay={[{
          key: '1-1',
          label: '一级菜单',
          children: [{
            key: '1-1-1',
            label: '二级菜单',
          }, {
            key: '1-1-2',
            label: '二级菜单',
            children: [{
              key: '1-1-1-3',
              label: '三级菜单',
              children: [{
                key: '1-1-1-1-4',
                label: '四级菜单',
              }]
            }]
          }]
        }, {
          key: '1-2',
          label: '一级菜单',
        }, {
          key: '1-3',
          label: '一级菜单',
          children: [{
            key: '1-3-1',
            label: '二级菜单',
          }, {
            key: '1-3-2',
            label: '二级菜单',
          }, {
            key: '1-3-3',
            label: '二级菜单',
          }, {
            key: '1-3-4',
            label: '二级菜单',
          }, {
            key: '1-3-5',
            label: '二级菜单',
          }, {
            key: '1-3-6',
            label: '二级菜单',
          }, {
            key: '1-3-7',
            label: '二级菜单',
          }, {
            key: '1-3-8',
            label: '二级菜单',
          }, {
            key: '1-3-9',
            label: '二级菜单',
          }, {
            key: '1-3-10',
            label: '二级菜单',
          }, {
            key: '1-3-11',
            label: '二级菜单',
          }, {
            key: '1-3-12',
            label: '二级菜单',
          }]
        }, {
          key: '1-4',
          label: '一级菜单',
        }, {
          key: '1-5',
          label: '一级菜单',
        }, {
          key: '1-6',
          label: '一级菜单',
        }, {
          key: '1-7',
          label: '一级菜单',
        }, {
          key: '1-8',
          label: '一级菜单',
        }, {
          key: '1-9',
          label: '一级菜单',
        }, {
          key: '1-10',
          label: '一级菜单',
        }, {
          key: '1-11',
          label: '一级菜单',
        }, {
          key: '1-12',
          label: '一级菜单',
          children: [{
            key: '1-12-1',
            label: '二级菜单',
          }, {
            key: '1-12-2',
            label: '二级菜单',
          }]
        }]}
      />
    </div>
  );
};

export const IconContextMenu = () => {
  const { contextMenu, onSetContextMenu } = useContextMenu();

  return (
    <div>
      <button
        onContextMenu={(e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();
          onSetContextMenu(e);
        }}
        style={{ position: 'fixed', right: 150 }}
      >
        右击我
      </button>
      <ContextMenu
        contextMenu={contextMenu}
        overlay={[{
          key: '1-1',
          label: '一级菜单',
          icon: <LockNonzeroOutlined />,
        }, {
          key: '1-2',
          label: '一级菜单',
          icon: <AutosaveOutlined />,
        }, {
          key: '1-3',
          label: '一级菜单',
          icon: <AutosaveOutlined />,
          arrow: <CalenderRightOutlined color={black[500]} />,
        }]}
      />
    </div>
  );
};

export const DisabledContextMenu = () => {
  const { contextMenu, onSetContextMenu } = useContextMenu();

  return (
    <div>
      <button
        onContextMenu={(e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();
          onSetContextMenu(e);
        }}
      >
        右击我
      </button>
      <ContextMenu
        contextMenu={contextMenu}
        overlay={[{
          key: '1-1',
          label: '一级菜单',
          icon: <LockNonzeroOutlined />,
          disabled: true,
          disabledTip: '禁用我禁用我禁用我禁用我'
        }, {
          key: '1-2',
          label: '一级菜单',
          icon: <AutosaveOutlined />,
        }, {
          key: '1-3',
          label: '一级菜单',
          icon: <AutosaveOutlined />,
          arrow: <CalenderRightOutlined color={black[500]} />,
          disabled: true,
          disabledTip: '禁用我禁用我禁用我禁用我'
        }]}
      />
    </div>
  );
};

export const ExtraElementContextMenu = () => {
  const { contextMenu, onSetContextMenu } = useContextMenu();

  return (
    <div>
      <button
        onContextMenu={(e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();
          onSetContextMenu(e);
        }}
      >
        右击我
      </button>
      <ContextMenu
        contextMenu={contextMenu}
        overlay={[{
          key: '1-1',
          label: '一级菜单一级菜单一级菜单一级菜单',
          icon: <LockNonzeroOutlined />,
          disabled: true,
          arrow: <CalenderRightOutlined color={black[500]} />,
          extraElement: <Switch size={'small'} disabled checked />
        }, {
          key: '1-2',
          label: '线上方插入行',
          icon: <AutosaveOutlined />,
          extraElement: <>Ctrl + Space + Enter</>
        }, {
          key: '1-3',
          label: '一级菜单',
          icon: <AutosaveOutlined />,
          arrow: <CalenderRightOutlined color={black[500]} />,
          disabled: true,
        }]}
      />
    </div>
  );
};

export const HiddenContextMenu = () => {
  const { contextMenu, onSetContextMenu } = useContextMenu();

  return (
    <div>
      <button
        onContextMenu={(e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();
          onSetContextMenu(e, { tabIndex: 1 });
        }}
      >
        右击我
      </button>
      <ContextMenu
        contextMenu={contextMenu}
        overlay={[{
          key: '1-1',
          label: '一级菜单',
          icon: <LockNonzeroOutlined />,
          disabled: true,
          extraElement: <Switch size={'small'} disabled checked />,
          hidden: true,
        }, {
          key: '1-2',
          label: '一级菜单',
          icon: <AutosaveOutlined />,
          extraElement: <Switch size={'small'} checked={false} />
        }, {
          key: '1-3',
          label: '一级菜单',
          icon: <AutosaveOutlined />,
          arrow: <CalenderRightOutlined color={black[500]} />,
          disabled: true,
          hidden: (args) => {
            return args.tabIndex === 1;
          }
        }]}
      />
    </div>
  );
};

export const GroupContextMenu = () => {
  const { contextMenu, onSetContextMenu, onCancelContextMenu } = useContextMenu();

  return (
    <div>
      <button
        onContextMenu={(e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();
          onSetContextMenu(e, { tabIndex: 1 });
        }}
      >
        右击我
      </button>
      <ContextMenu
        contextMenu={contextMenu}
        overlay={[{
          key: '1-1',
          label: '一级菜单 - 1',
          icon: <LockNonzeroOutlined />,
          disabled: true,
          extraElement: <Switch size={'small'} disabled checked />,
          groupId: '1',
        }, {
          key: '1-2',
          label: '一级菜单 - 2',
          icon: <AutosaveOutlined />,
          extraElement: <Switch size={'small'} checked={false} />,
          groupId: '1',
          onClick: onCancelContextMenu,
        }, {
          key: '1-3',
          label: '一级菜单 - 3',
          icon: <AutosaveOutlined />,
          extraElement: <Switch size={'small'} checked={false} />,
          groupId: '1',
          hidden: true,
        }, {
          key: '1-4',
          label: '一级菜单 - 4',
          icon: <AutosaveOutlined />,
          extraElement: <Switch size={'small'} checked={false} />,
          groupId: '1',
          hidden: true,
        }, {
          key: '1-5',
          label: '一级菜单 - 5',
          icon: <AutosaveOutlined />,
          arrow: <CalenderRightOutlined color={black[500]} />,
          disabled: true,
          hidden: () => {
            return false;
          },
          groupId: '2',
        }]}
      />
    </div>
  );
};

export const EventMangerContextMenu = () => {
  const menuId = 'context-menu';
  const { show } = useContextMenu({ id: menuId });

  return (
    <div>
      <button
        onContextMenu={(e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();
          show(e, { info: '额外信息' });
        }}
        style={{ marginTop: 400 }}
      >
        右击我
      </button>
      <ContextMenu
        menuId={menuId}
        overlay={[{
          key: '1-1',
          label: '一级菜单 - 1',
          icon: <LockNonzeroOutlined />,
          disabled: true,
          extraElement: <Switch size={'small'} disabled checked />,
          groupId: '1',
        }, {
          key: '1-2',
          label: '一级菜单 - 1',
          icon: <LockNonzeroOutlined />,
          extraElement: <Switch size={'small'} disabled checked />,
          groupId: '2',
          onClick: (args) => console.log(args),
        }, {
          key: '1-3',
          label: '一级菜单 - 1',
          icon: <LockNonzeroOutlined />,
          extraElement: <Switch size={'small'} disabled checked />,
          groupId: '2',
          onClick: (args) => console.log(args),
          arrow: <CalenderRightOutlined color={black[500]} />,
          children: [{
            key: '1-1-1',
            label: '二级菜单',
          }, {
            key: '1-1-2',
            label: '二级菜单',
          }, {
            key: '1-1-3',
            label: '二级菜单',
          }, {
            key: '1-1-4',
            label: '二级菜单',
          }, {
            key: '1-1-5',
            label: '二级菜单',
          }, {
            key: '1-1-6',
            label: '二级菜单',
          }, {
            key: '1-1-7',
            label: '二级菜单',
          }, {
            key: '1-1-8',
            label: '二级菜单',
          }],
        }, {
          key: '1-4',
          label: '一级菜单 - 1',
          icon: <LockNonzeroOutlined />,
          extraElement: <Switch size={'small'} disabled checked />,
          groupId: '2',
          onClick: (args) => console.log(args),
        }, {
          key: '1-5',
          label: '一级菜单 - 1',
          icon: <LockNonzeroOutlined />,
          extraElement: <Switch size={'small'} disabled checked />,
          groupId: '2',
          onClick: (args) => console.log(args),
        }, {
          key: '1-6',
          label: '一级菜单 - 1',
          icon: <LockNonzeroOutlined />,
          extraElement: <Switch size={'small'} disabled checked />,
          groupId: '2',
          onClick: (args) => console.log(args),
        }]}
      />
    </div>
  );
};
