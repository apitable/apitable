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

import { useLocalStorageState } from 'ahooks';
import { Button, TextInput } from '@apitable/components';
import { WidgetStandAloneProvider } from '@apitable/widget-sdk';
import { useWidgetComponent } from '@apitable/widget-sdk/dist/hooks/private/use_widget_loader';
import styles from './style.module.less';

function WidgetAlone() {
  const [datasheetId, setDatasheetId] = useLocalStorageState<string>('datasheetId');
  const [widgetId, setWidgetId] = useLocalStorageState<string>('widgetId');
  const [codeUrl, setCodeUrl] = useLocalStorageState<string>('codeUrl');
  const [WidgetComponent, refresh] = useWidgetComponent(codeUrl);

  return (
    <div className={styles.main}>
      <div className={styles.config}>
        输入 integration 的 datasheetId:
        <TextInput type="text" value={datasheetId} onChange={(e) => setDatasheetId(e.target.value)} />
        widgetId:
        <TextInput type="text" value={widgetId} onChange={(e) => setWidgetId(e.target.value)} />
      </div>
      <div className={styles.config}>
        输入小组件代码地址：
        <TextInput type="text" value={codeUrl} onChange={(e) => setCodeUrl(e.target.value)} />
        <Button color="primary" onClick={() => refresh()}>
          刷新
        </Button>
      </div>
      {datasheetId && widgetId && (
        <div className={styles.widgetStage}>
          <WidgetStandAloneProvider id={widgetId} datasheetId={datasheetId}>
            {WidgetComponent && <WidgetComponent />}
          </WidgetStandAloneProvider>
        </div>
      )}
    </div>
  );
}

export default WidgetAlone;
