import { ISnapshot } from '../../exports/store';
import { IViewProperty } from '../../exports/store/interfaces';
import { getViewById } from '../../exports/store/selectors';
import { Strings, t } from 'i18n';
import { IBindViewModal } from '.';

/**
 * here's `views` means table view / gallery view, not `view` in table area.
 */
export abstract class View {
  static bindModel: IBindViewModal;
  static getSrcView(snapshot: ISnapshot, activeViewId: string | null | undefined) {
    const views = snapshot.meta.views;
    let srcView: IViewProperty | undefined;
    if (activeViewId) {
      srcView = getViewById(snapshot, activeViewId);
    }

    if (!srcView) {
      srcView = views[0];
    }
    return srcView;
  }

  static defaultRows(srcView: IViewProperty) {
    if (srcView) {
      return srcView.rows;
    }
    return [];
  }

  /** 
   *  `record` has different name in different view, such as `row`, `record`, `task`, etc.
   * every view need to define their own name of record.
   */
  get recordShowName() {
    return t(Strings.record);
  }

  get recordShowUnit(){
    // TODO: i18n
    return '条';
  }
}
