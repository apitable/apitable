import { ISnapshot } from 'store';
import { IViewProperty } from 'store/interface';
import { getViewById } from 'store/selector';
import { Strings, t } from 'i18n';
import { IBindViewModal } from '.';

/**
 * 这里的 views 指的是表格视图、相册视图等，跟 view 表格区域区分开来。
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
  /** 记录在不同视图中的叫法，行、记录、任务等等，每个视图需要定义自己关于记录书面叫法 */
  get recordShowName() {
    return t(Strings.record);
  }

  get recordShowUnit(){
    // TODO: i18n
    return '条';
  }
}
