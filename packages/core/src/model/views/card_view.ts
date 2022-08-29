import { IGridViewColumn, IViewColumn, IViewProperty } from 'store/interface';
import { View } from './views';

export abstract class CardView extends View {
  static defaultColumns(srcView: IViewProperty, columnCount: number) {
    if (!srcView) {
      throw Error('未找到源视图');
    }
    let count = 0;
    const columns: IViewColumn[] = (srcView.columns as IGridViewColumn[]).reduce((columns, column) => {
      if (column.hidden || count >= columnCount) {
        columns.push({ ...column, hidden: true });
        return columns;
      }
      count++;
      columns.push({ ...column });
      return columns;
    }, [] as IGridViewColumn[]);

    return columns;
  }

}