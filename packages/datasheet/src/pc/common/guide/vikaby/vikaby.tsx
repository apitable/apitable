import { ThemeProvider, useThemeColors } from '@vikadata/components';
import {
  ConfigConstant, DATASHEET_ID, Events, isPrivateDeployment, Player, ScreenWidth, Selectors, Settings, StoreActions, Strings, t, VIKABY_ID,
} from '@apitable/core';
import {
  AdviseOutlined, ClassroomOutlined, FixedOutlined, InviteSmallFilled, RoadmapOutlined, TaskOutlined, ViewContactOutlined,
} from '@vikadata/icons';
import { useToggle } from 'ahooks';
import { Popover } from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { compact } from 'lodash';
import Image from 'next/image';
import { TriggerCommands } from 'pc/common/apphook/trigger_commands';
import { isWecomFunc } from 'pc/components/home/social_platform';
import { AccountCenterModal } from 'pc/components/navigation/account_center_modal';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { store } from 'pc/store';
import { getEnvVariables, isMobileApp } from 'pc/utils/env';
import { FC, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useDispatch, useSelector } from 'react-redux';
import VikabyActive from 'static/icon/onboarding/organization_img_vikaby_click.png';
import VikabyDefault from 'static/icon/onboarding/organization_img_vikaby_default.png';
import { Dialog, IDialog } from './dialog';
import styles from './style.module.less';
import { TaskCard } from './task_card';
import { TouchMove } from './touch_move';

interface IVikabyBase {
  defaultExpandMenu?: boolean;
  defaultExpandTodo?: boolean;
  defaultExpandDialog?: boolean;
  dialogConfig?: IDialog;
}

interface IOperateVikabyProps extends IVikabyBase {
  visible: boolean;
}

const VIKABY_ID_REMOVER = 'vika-vikaby';
const VIKABY_DEFAULT_POSITION = {
  left: 'calc(100% - 88px)',
  top: 'calc(100% - 88px)',
};
export const VIKABY_POSITION_SESSION_KEY = 'vikaby_position';
export const VIKABY_SUB_POPOVER_CLASS = 'VIKABY_SUB_POPOVER_CONTENT';
export const Vikaby: FC<IVikabyBase> = ({ defaultExpandMenu, defaultExpandTodo, defaultExpandDialog, dialogConfig }) => {
  const colors = useThemeColors();
  const isWecom = isWecomFunc();
  const sessionPosition = sessionStorage.getItem(VIKABY_POSITION_SESSION_KEY);
  const initPosition = sessionPosition ? JSON.parse(sessionPosition) : VIKABY_DEFAULT_POSITION;
  // todo卡片显示在document.body里还是vikaby的元素里，目前采用前者，因为后者方案会在点击todo时，会触发拖动事件
  const [taskCardVisible, { set: setTaskCardVisible }] = useToggle(defaultExpandTodo);
  const [menuVisible, { toggle: toggleMenuVisible, set: setMenuVisible }] = useToggle(defaultExpandMenu);
  const [dialogVisible, { set: setDialogVisible }] = useToggle(defaultExpandDialog);
  const [accountCenterVisible, setAccountCenterVisible] = useState(false);
  const dispatch = useDispatch();
  const env = getEnvVariables();

  const vikabyClick = e => {
    toggleMenuVisible();
    setTaskCardVisible(false);
  };
  const onDragStart = () => {
    console.log(123);
    setMenuVisible(false);
    setTaskCardVisible(false);
    setDialogVisible(false);
  };

  interface IMenuConfigItem {
    icon: JSX.Element;
    title: string;
    onClick: () => void;
    id?: string;
    invalid?: boolean;
  }

  const menuConfig: IMenuConfigItem[] = compact([
    !isWecom && {
      icon: <InviteSmallFilled />,
      title: t(Strings.vikaby_activity_train_camp),
      onClick: () => {
        const url = Settings.activity_train_camp_url.value;
        navigationToUrl(url);
      },
      invalid: !(dayjs().isAfter(Settings.activity_train_camp_start_time.value) && dayjs().isBefore(Settings.activity_train_camp_end_time.value)),
    },
    !isWecom && {
      icon: <RoadmapOutlined color={colors.thirdLevelText} />,
      title: t(Strings.vikaby_menu_releases_history),
      id: VIKABY_ID.UPDATE_LOGS_HISTORY,
      onClick: () => {
        const url = Settings.release_log_history_url.value;
        navigationToUrl(url);
        setMenuVisible(false);
      },
    },
    !isWecom && {
      icon: <TaskOutlined color={colors.thirdLevelText} />,
      title: t(Strings.vikaby_menu_beginner_task),
      onClick: () => {
        setTaskCardVisible(true);
        setMenuVisible(false);
      },
    },
    !isWecom && env.VIKA_CLASSROOM_URL && {
      icon: <ClassroomOutlined color={colors.thirdLevelText} />,
      title: t(Strings.vika_small_classroom),
      onClick: () => navigationToUrl(env.VIKA_CLASSROOM_URL!),
      invalid: isMobileApp(),
    },
    {
      icon: <ViewContactOutlined color={colors.thirdLevelText} />,
      title: t(Strings.player_contact_us),
      onClick: () => {
        dispatch(StoreActions.clearWizardsData());
        localStorage.setItem('vika_guide_start', 'vikaby');
        TriggerCommands.open_guide_wizard(ConfigConstant.WizardIdConstant.CONTACT_US_GUIDE);
        setMenuVisible(false);
      },
      invalid: !window.location.pathname.includes('workbench'),
    },
    !isWecom && {
      icon: <AdviseOutlined color={colors.thirdLevelText} />,
      title: t(Strings.user_feedback),
      onClick: () => {
        navigationToUrl(Settings['user_feedback_url'].value);
        setMenuVisible(false);
      },
    },
    {
      icon: <FixedOutlined color={colors.thirdLevelText} />,
      title: t(Strings.vikaby_menu_hidden_vikaby),
      onClick: () => {
        setMenuVisible(false);
        Player.doTrigger(Events.workbench_hidden_vikaby_btn_clicked);
        localStorage.setItem('vikaby_closed', 'true');
        destroyVikaby();
      },
    },
  ]);
  const handleMenuVisibleChange = visible => {
    setMenuVisible(visible);
  };

  const vikaby = (taskCardVisible || menuVisible || dialogVisible) ? VikabyActive : VikabyDefault;

  // 如果当前进入 “历史更新” 的智能引导，隐藏 vikaby 菜单时需要额外写代码清除智能引导组件。
  useEffect(() => {
    if (!menuVisible) {
      const state = store.getState();
      const hooks = state.hooks;
      const { curGuideWizardId } = hooks;
      if (curGuideWizardId === ConfigConstant.WizardIdConstant.VIKABY_UPDATE_LOGS_HISTORY) {
        TriggerCommands.clear_guide_all_ui();
      }
    }
  }, [menuVisible]);

  const popoverVisible = useMemo(() => {
    return taskCardVisible || dialogVisible;
  }, [taskCardVisible, dialogVisible]);

  const outerPopoverContent = useMemo(() => {
    if (taskCardVisible) {
      return {
        overlayClassName: classNames(VIKABY_SUB_POPOVER_CLASS, styles.vikabyTaskCard),
        content: (
          <TaskCard onClose={() => setTaskCardVisible(false)} setAccountCenterVisible={setAccountCenterVisible} />
        ),
      };
    } else if (dialogVisible) {
      return {
        overlayClassName: classNames(
          VIKABY_SUB_POPOVER_CLASS,
          styles.vikabyDialog,
          dialogConfig?.dialogClx === 'billingNotify' ? styles.billingNotify : dialogConfig?.dialogClx,
        ),
        content: (
          <Dialog
            {...dialogConfig}
            onClose={() => {
              dialogConfig?.onClose && dialogConfig.onClose();
              setDialogVisible(false);
            }}
          />
        ),
      };
    }
    return {};
  }, [taskCardVisible, dialogVisible, setDialogVisible, setTaskCardVisible, dialogConfig]);

  if (isMobileApp() || isPrivateDeployment()) {
    return null;
  }

  return (
    <>
      <Popover
        {...outerPopoverContent}
        placement='leftBottom'
        visible={popoverVisible}
        destroyTooltipOnHide
      >
        <Popover
          content={<>{menuConfig.map(item =>
            (!item.invalid &&
              <div
                onClick={item.onClick}
                className={styles.vikabyMenuItem}
                key={item.title}
                data-sensors-click
                id={item.id}
              >
                {item.icon}{item.title}
              </div>
            ),
          )}</>}
          trigger='click'
          overlayClassName={styles.vikabyMenu}
          placement='topRight'
          visible={menuVisible}
          onVisibleChange={handleMenuVisibleChange}
        >
          <TouchMove
            id={VIKABY_ID_REMOVER}
            sessionStorageKey={VIKABY_POSITION_SESSION_KEY}
            initPosition={initPosition}
            onClick={vikabyClick}
            onDragStart={onDragStart}
          >
            <div className={styles.vikabyWrap} id={DATASHEET_ID.VIKABY}>
              <div className={styles.vikaby} style={{ position: 'relative' }}>
                <Image src={vikaby} layout={'fill'} draggable={false} />
              </div>
            </div>
          </TouchMove>
        </Popover>
      </Popover>
      {accountCenterVisible && <AccountCenterModal setShowAccountCenter={setAccountCenterVisible} />}
    </>
  );
};

const VikabyWithTheme = (props) => {
  const cacheTheme = useSelector(Selectors.getTheme);
  return (
    <ThemeProvider theme={cacheTheme}>
      <Vikaby {...props} />
    </ThemeProvider>
  );
};

export const showVikaby = (props?: IVikabyBase) => {
  const render = () => {
    setTimeout(() => {
      const dom = document.querySelector(`#${VIKABY_ID_REMOVER}`);
      if (dom) {
        return;
      }
      const div = document.createElement('div');
      document.body.appendChild(div);
      const root = createRoot(div);
      root.render(
        (<Provider store={store}>
          <VikabyWithTheme {...props} />
        </Provider>));
    });
  };

  const run = () => {
    destroyVikaby();
    render();
  };

  const state = store.getState();
  const templateId = state.pageParams.templateId;
  const shareId = state.pageParams.shareId;
  const isPc = window.innerWidth > ScreenWidth.md;
  if (!templateId && !shareId && window.location.pathname.includes('workbench') && isPc) {
    run();
  }
};

export const destroyVikaby = () => {
  const destroy = () => {
    const dom = document.querySelector(`#${VIKABY_ID_REMOVER}`);
    if (dom && dom.parentNode) {
      document.body.removeChild(dom.parentNode);
    }

    const subPopover = document.querySelector(`.${VIKABY_SUB_POPOVER_CLASS}`);
    if (subPopover && subPopover.parentNode && subPopover.parentNode.parentNode) {
      document.body.removeChild(subPopover.parentNode.parentNode);
    }
  };
  destroy();
};

export const openVikaby: (data: IOperateVikabyProps) => void = (props) => {
  const { visible, ...rest } = props;
  if (visible) {
    localStorage.removeItem('vikaby_closed');
    showVikaby({ ...rest });
  } else {
    destroyVikaby();
  }
};
