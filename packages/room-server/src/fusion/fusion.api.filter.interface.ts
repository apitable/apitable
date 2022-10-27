import { FieldKeyEnum, IFieldMap, IReduxState, ISnapshot, IViewProperty, IViewRow } from '@apitable/core';
import { RecordQueryRo } from './ros/record.query.ro';
import { Store } from 'redux';

/**
 * <p>
 * fusionApi字段过滤服务
 * </p>
 * @author Zoe zheng
 * @date 2020/7/31 5:43 下午
 */

export interface IFusionApiFilterInterface {
  /**
   * 根据传入的fields过滤filedMap，fields可能为ID也可能为名称 // todo 目前只考虑名称
   * @param filedMap
   * @param fieldKey
   * @param fields
   * @return IFieldMap
   * @author Zoe Zheng
   * @date 2020/7/31 5:46 下午
   */
  fieldMapFilter(filedMap: IFieldMap, fieldKey: FieldKeyEnum, fields?: string[]): IFieldMap;
  /**
   * 筛选
   * @param expression
   * @param rows record对应的数据
   * @param snapshot
   * @param state
   * @return 筛选后的rows
   * @author Zoe Zheng
   * @date 2020/8/3 6:49 下午
   */
  formulaFilter(expression: string, rows: IViewRow[], snapshot: ISnapshot, state: IReduxState): IViewRow[];

  /**
   * 获取最终返回的rows
   * @param query
   * @param view
   * @param store
   * @return
   * @author Zoe Zheng
   * @date 2020/8/28 4:11 下午
   */
  getVisibleRows(query: RecordQueryRo, view: IViewProperty, store: Store<IReduxState>): IViewRow[] | null;

  /**
   *
   * @param expression 公式
   * @param state redux state
   * @return
   * @author Zoe Zheng
   * @date 2020/10/12 3:55 下午
   */
  validateExpression(expression: string, state: IReduxState): string;
}
