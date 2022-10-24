import { Tooltip } from 'antd';
import { Selectors, Strings, t } from '@apitable/core';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import styles from './style.module.less';
import classNames from 'classnames';
import { useThemeColors } from '@vikadata/components';
import { AutoSaveLottie } from 'pc/components/tab_bar/view_sync_switch/auto_save_lottie';
import Trigger from 'rc-trigger';
import { useClickAway, useToggle } from 'ahooks';
import { PopupContent } from 'pc/components/tab_bar/view_sync_switch/popup_content';
import { ManualSaveLottie } from 'pc/components/tab_bar/view_sync_switch/manual_save_lottie';

export const ViewSyncStatus = ({ viewId }) => {
  const colors = useThemeColors();
  const { datasheetId, shareId } = useSelector(state => state.pageParams)!;
  const snapshot = useSelector(Selectors.getSnapshot)!;
  const [visible, { toggle }] = useToggle(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const currentView = useSelector(state => {
    return Selectors.getCurrentViewBase(snapshot, viewId, datasheetId);
  });
  const isViewAutoSave = Boolean(currentView?.autoSave);
  const isViewLock = Boolean(currentView?.lockInfo);

  useClickAway(() => {
    toggle();
  }, contentRef, 'mousedown');

  return <Tooltip
    title={isViewAutoSave ? t(Strings.auto_save_has_been_opend) : t(Strings.view_configuration_tooltips)}
  >
    <Trigger
      popup={
        <PopupContent
          autoSave={isViewAutoSave}
          viewId={viewId}
          datasheetId={datasheetId!}
          onClose={toggle}
          contentRef={contentRef}
          shareId={shareId}
          isViewLock={isViewLock}
        />
      }
      destroyPopupOnHide
      popupAlign={
        { points: ['tc', 'bc'], offset: [0, 10], overflow: { adjustX: true, adjustY: true }}
      }
      popupStyle={{
        position: 'absolute',
        zIndex: 1000,
        width: 320,
        background: colors.highestBg,
        boxShadow: colors.shadowCommonHighest,
        borderRadius: '4px',
      }}
      popupVisible={visible}
    >
      <div
        className={classNames({
          [styles.syncSpan]: currentView?.autoSave,
        })}
        id={'view_item_sync_icon'}
        style={{ margin: '0px 4px', width: 16, height: 16, display: 'flex' }}
        onClick={(e) => {
          toggle();
        }}
      >
        {
          isViewAutoSave ? <AutoSaveLottie /> : <ManualSaveLottie />
        }
        {
          visible && <span className={styles.arrow} />
        }
      </div>
    </Trigger>
  </Tooltip>;
};
