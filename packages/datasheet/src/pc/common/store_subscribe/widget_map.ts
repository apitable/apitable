
import { subscribeWidgetMap } from '@vikadata/widget-sdk';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';

subscribeWidgetMap(store, resourceService as any);
