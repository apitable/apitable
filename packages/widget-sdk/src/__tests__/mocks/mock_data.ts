import { IRecordMap, StoreActions, ViewDerivateFactory, ViewType } from '@apitable/core';
import { IWidgetState } from 'interface/store';
import { AnyAction, createStore } from 'redux';
import { getSnapshot, getViewById, IWidgetStore } from 'store';
import { rootReducers } from 'store/slice/root';
import { mockWidgetSdkStore } from './mock_store';
import { simpleDatasheet } from './simple_datasheet';
import { simpleLinkDatasheet } from './simple_link_datasheet';

export class MockWidgetSdkData {
  widgetStore: IWidgetStore;

  constructor(initData: IWidgetState) {
    this.widgetStore = createStore(rootReducers, initData);
  }

  static simpleDatasheetExample() {
    return new MockWidgetSdkData(simpleDatasheet);
  }
  static simpleLinkDatasheetExample() {
    return new MockWidgetSdkData(simpleLinkDatasheet());
  }

  static createSimpleStoreData(mockData: Partial<IWidgetState>) {
    const sdkStore = mockWidgetSdkStore(mockData);
    return new MockWidgetSdkData(sdkStore);
  }

  get widgetSdkData() {
    return this.widgetStore.getState();
  }

  dispatch(action: AnyAction) {
    this.widgetStore.dispatch(action);
  }

  addRecords(recordMap: IRecordMap, datasheetId?: string) {
    const snapshot = getSnapshot(this.widgetSdkData as any, datasheetId);
    if (!snapshot || !snapshot?.datasheetId) {
      throw new Error(`Can't find ${datasheetId || 'datasheetId'} in widgetSdkData`);
    }
    
    this.dispatch(StoreActions.updateSnapshot(snapshot!.datasheetId, {
      ...snapshot,
      recordMap, 
      meta: {
        ...snapshot.meta,
        views: snapshot.meta.views.map(view => {
          return {
            ...view,
            rows: (view.rows || []).concat(Object.keys(recordMap).map(recordId => ({ recordId })))
          };
        })
      }
    }));

    this.updateViewDerivation(snapshot.datasheetId);
  }

  updateViewDerivation(datasheetId?: string, viewId?: string) {
    const snapshot = getSnapshot(this.widgetSdkData, datasheetId);
    if (!snapshot || !snapshot?.datasheetId) {
      throw new Error(`Can't find ${datasheetId || 'datasheetId'} in widgetSdkData`);
    }
    const _viewId = viewId || snapshot?.meta?.views[0]?.id;

    if (!_viewId) {
      throw new Error(`Can't find ${_viewId || 'viewId'} in widgetSdkData`);
    }

    const viewDerivate = ViewDerivateFactory.createViewDerivate(this.widgetSdkData as any, snapshot.datasheetId, ViewType.Grid);
    const view = getViewById(this.widgetSdkData, snapshot.datasheetId, _viewId!)!;
    const viewDerivation = viewDerivate.getViewDerivation(view);
    this.dispatch(StoreActions.setViewDerivation(snapshot.datasheetId, {
      viewId: view.id,
      viewDerivation
    }));
  }
}