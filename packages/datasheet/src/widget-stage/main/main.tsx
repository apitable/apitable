import { GlobalContextProvider } from '@vikadata/widget-sdk';
import classnames from 'classnames';
import React from 'react';
import styles from './style.module.less';
import { WidgetBlock } from './widget/widget_block';
import WidgetAlone from './widget_alone';

export const Main: React.FC = () => {
  const query = new URLSearchParams(window.location.search);
  const isAlone = query.get('isAlone');
  const widgetId = query.get('widgetId');
  if (!widgetId && !isAlone) {
    return <>No widgetId</>;
  }
  return (
    <div className={classnames(styles.main, 'main')}>
      { !isAlone ? <WidgetBlock widgetId={widgetId!} /> :
        <GlobalContextProvider><WidgetAlone /></GlobalContextProvider>}
    </div>
  );
};
