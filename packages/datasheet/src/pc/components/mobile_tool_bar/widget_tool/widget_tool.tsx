import { IconButton } from '@vikadata/components';
import { ResourceType, Selectors } from '@vikadata/core';
import { WidgetOutlined } from '@vikadata/icons';
import { ShortcutActionManager, ShortcutActionName } from 'pc/common/shortcut_key';
import { WidgetPanel } from 'pc/components/widget';
import { useMountWidgetPanelShortKeys } from 'pc/components/widget/hooks';
import { useSelector } from 'react-redux';
import { Popup } from '../../common/mobile/popup';
import styles from './style.module.less';

export const WidgetTool = () => {
  const isOpenPanel = useSelector(state => {
    const { mirrorId, datasheetId } = state.pageParams;
    const resourceType = mirrorId ? ResourceType.Mirror : ResourceType.Datasheet;
    const resourceId = mirrorId || datasheetId || '';
    return Boolean(Selectors.getResourceWidgetPanelStatus(state, resourceId, resourceType)?.opening);
  });

  const togglePanel = () => {
    ShortcutActionManager.trigger(ShortcutActionName.ToggleWidgetPanel);
  };

  useMountWidgetPanelShortKeys();

  return (
    <>
      <IconButton className={styles.widgetTool} icon={WidgetOutlined} onClick={togglePanel}/>
      <Popup
        className={styles.widgetToolPopup}
        visible={isOpenPanel}
        placement='right'
        width={'100vw'}
        height={'100vh'}
        closable={false}
        bodyStyle={{
          padding: '0'
        }}
      >
        <WidgetPanel />
      </Popup>
    </>
  );
};