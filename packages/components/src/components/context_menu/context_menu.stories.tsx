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

import React from 'react';
import { AutosaveOutlined, LockOutlined, ChevronRightOutlined } from '@apitable/icons';
import { black } from 'colors';
import { Switch } from '../switch';
import { ContextMenu, useContextMenu } from './index';
import { StoryType } from '../../stories/constants';

const COMPONENT_NAME = 'ContextMenu';

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
        right click to open context menu
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
        right click
      </button>
      <ContextMenu
        contextMenu={contextMenu}
        overlay={[{
          key: '1-1',
          label: 'first layer menu 1',
        }, {
          key: '1-2',
          label: 'first layer menu 2',
        }, {
          key: '1-3',
          label: 'first layer menu 3',
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
        right click
      </button>
      <ContextMenu
        contextMenu={contextMenu}
        width={500}
        overlay={[{
          key: '1-1',
          label: 'first layer menu',
          children: [{
            key: '1-1-1',
            label: 'second layer menu',
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
        right click
      </button>
      <ContextMenu
        contextMenu={contextMenu}
        overlay={[{
          key: '1-1',
          label: 'first layer menu',
          children: [{
            key: '1-1-1',
            label: 'second layer menu 1',
          }, {
            key: '1-1-2',
            label: 'second layer menu 2',
            children: [{
              key: '1-1-1-3',
              label: 'third layer menu',
              children: [{
                key: '1-1-1-1-4',
                label: 'fourth layer menu',
              }]
            }]
          }]
        }, {
          key: '1-2',
          label: 'first layer menu 2',
        }, {
          key: '1-3',
          label: 'first layer menu 3',
          children: [{
            key: '1-3-1',
            label: 'second layer menu 1',
          }, {
            key: '1-3-2',
            label: 'second layer menu 2',
          }, {
            key: '1-3-3',
            label: 'second layer menu 3',
          }, {
            key: '1-3-4',
            label: 'second layer menu 4',
          }, {
            key: '1-3-5',
            label: 'second layer menu 5',
          }, {
            key: '1-3-6',
            label: 'second layer menu 6',
          }, {
            key: '1-3-7',
            label: 'second layer menu 7',
          }, {
            key: '1-3-8',
            label: 'second layer menu 8',
          }, {
            key: '1-3-9',
            label: 'second layer menu 9',
          }, {
            key: '1-3-10',
            label: 'second layer menu 10',
          }, {
            key: '1-3-11',
            label: 'second layer menu 11',
          }, {
            key: '1-3-12',
            label: 'second layer menu 12',
          }]
        }, {
          key: '1-4',
          label: 'first layer menu 4',
        }, {
          key: '1-5',
          label: 'first layer menu 5',
        }, {
          key: '1-6',
          label: 'first layer menu 6',
        }, {
          key: '1-7',
          label: 'first layer menu 7',
        }, {
          key: '1-8',
          label: 'first layer menu 8',
        }, {
          key: '1-9',
          label: 'first layer menu 9',
        }, {
          key: '1-10',
          label: 'first layer menu 10',
        }, {
          key: '1-11',
          label: 'first layer menu 11',
        }, {
          key: '1-12',
          label: 'first layer menu 12',
          children: [{
            key: '1-12-1',
            label: 'second layer menu 1',
          }, {
            key: '1-12-2',
            label: 'second layer menu 2',
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
        right click
      </button>
      <ContextMenu
        contextMenu={contextMenu}
        overlay={[{
          key: '1-1',
          label: 'first layer menu 1',
          icon: <LockOutlined />,
        }, {
          key: '1-2',
          label: 'first layer menu 2',
          icon: <AutosaveOutlined />,
        }, {
          key: '1-3',
          label: 'first layer menu 3',
          icon: <AutosaveOutlined />,
          arrow: <ChevronRightOutlined color={black[500]} />,
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
        right click
      </button>
      <ContextMenu
        contextMenu={contextMenu}
        overlay={[{
          key: '1-1',
          label: 'first layer menu 1',
          icon: <LockOutlined />,
          disabled: true,
          disabledTip: 'disabled tips'
        }, {
          key: '1-2',
          label: 'first layer menu 2',
          icon: <AutosaveOutlined />,
        }, {
          key: '1-3',
          label: 'first layer menu 3',
          icon: <AutosaveOutlined />,
          arrow: <ChevronRightOutlined color={black[500]} />,
          disabled: true,
          disabledTip: 'disabled tips'
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
        right click
      </button>
      <ContextMenu
        contextMenu={contextMenu}
        overlay={[{
          key: '1-1',
          label: 'first layer menu 1',
          icon: <LockOutlined />,
          disabled: true,
          arrow: <ChevronRightOutlined color={black[500]} />,
          extraElement: <Switch size={'small'} disabled checked />
        }, {
          key: '1-2',
          label: 'first layer menu 2',
          icon: <AutosaveOutlined />,
          extraElement: <>Ctrl + Space + Enter</>
        }, {
          key: '1-3',
          label: 'first layer menu 3',
          icon: <AutosaveOutlined />,
          arrow: <ChevronRightOutlined color={black[500]} />,
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
        right click
      </button>
      <ContextMenu
        contextMenu={contextMenu}
        overlay={[{
          key: '1-1',
          label: 'first layer menu 1',
          icon: <LockOutlined />,
          disabled: true,
          extraElement: <Switch size={'small'} disabled checked />,
          hidden: true,
        }, {
          key: '1-2',
          label: 'first layer menu 2',
          icon: <AutosaveOutlined />,
          extraElement: <Switch size={'small'} checked={false} />
        }, {
          key: '1-3',
          label: 'first layer menu 3',
          icon: <AutosaveOutlined />,
          arrow: <ChevronRightOutlined color={black[500]} />,
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
        right click
      </button>
      <ContextMenu
        contextMenu={contextMenu}
        overlay={[{
          key: '1-1',
          label: 'first layer menu 1',
          icon: <LockOutlined />,
          disabled: true,
          extraElement: <Switch size={'small'} disabled checked />,
          groupId: '1',
        }, {
          key: '1-2',
          label: 'first layer menu 2',
          icon: <AutosaveOutlined />,
          extraElement: <Switch size={'small'} checked={false} />,
          groupId: '1',
          onClick: onCancelContextMenu,
        }, {
          key: '1-3',
          label: 'first layer menu 3',
          icon: <AutosaveOutlined />,
          extraElement: <Switch size={'small'} checked={false} />,
          groupId: '1',
          hidden: true,
        }, {
          key: '1-4',
          label: 'first layer menu 4',
          icon: <AutosaveOutlined />,
          extraElement: <Switch size={'small'} checked={false} />,
          groupId: '1',
          hidden: true,
        }, {
          key: '1-5',
          label: 'first layer menu 5',
          icon: <AutosaveOutlined />,
          arrow: <ChevronRightOutlined color={black[500]} />,
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
          show(e, { info: 'extra message' });
        }}
        style={{ marginTop: 400 }}
      >
        right click
      </button>
      <ContextMenu
        menuId={menuId}
        overlay={[{
          key: '1-1',
          label: 'first layer menu 1',
          icon: <LockOutlined />,
          disabled: true,
          extraElement: <Switch size={'small'} disabled checked />,
          groupId: '1',
        }, {
          key: '1-2',
          label: 'first layer menu 2',
          icon: <LockOutlined />,
          extraElement: <Switch size={'small'} disabled checked />,
          groupId: '2',
          onClick: (args) => console.log(args),
        }, {
          key: '1-3',
          label: 'first layer menu 3',
          icon: <LockOutlined />,
          extraElement: <Switch size={'small'} disabled checked />,
          groupId: '2',
          onClick: (args) => console.log(args),
          arrow: <ChevronRightOutlined color={black[500]} />,
          children: [{
            key: '1-1-1',
            label: 'second layer menu 1',
          }, {
            key: '1-1-2',
            label: 'second layer menu 2',
          }, {
            key: '1-1-3',
            label: 'second layer menu 3',
          }, {
            key: '1-1-4',
            label: 'second layer menu 4',
          }, {
            key: '1-1-5',
            label: 'second layer menu 5',
          }, {
            key: '1-1-6',
            label: 'second layer menu 6',
          }, {
            key: '1-1-7',
            label: 'second layer menu 7',
          }, {
            key: '1-1-8',
            label: 'second layer menu 8',
          }],
        }, {
          key: '1-4',
          label: 'first layer menu 4',
          icon: <LockOutlined />,
          extraElement: <Switch size={'small'} disabled checked />,
          groupId: '2',
          onClick: (args) => console.log(args),
        }, {
          key: '1-5',
          label: 'first layer menu 5',
          icon: <LockOutlined />,
          extraElement: <Switch size={'small'} disabled checked />,
          groupId: '2',
          onClick: (args) => console.log(args),
        }, {
          key: '1-6',
          label: 'first layer menu 6',
          icon: <LockOutlined />,
          extraElement: <Switch size={'small'} disabled checked />,
          groupId: '2',
          onClick: (args) => console.log(args),
        }]}
      />
    </div>
  );
};
