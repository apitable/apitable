export interface IListBase<T, L> {
  /**
   * @description 已经存在的数据
   * 对于 cell 来说，就是 cellValue
   * 对于 filter 来说，就是 filterValue
   * @type {(IUnitIds | null)}
  */
  existValues: T;

  /**
   * @description 下拉框中每个选项的点击回调
   * @param {T} value
   */
  onClickItem (value: T): void;

  /**
   * @description 标注当前是单选模式还是多选模式
   * @type {boolean}
   */
  multiMode: boolean;

  /**
   * @description 下拉列表中需要显示的数据，如果不传入，就会使用 memberStash 类中存储的数据
   * @type {L}
   */
  listData?: L;

  /**
   * @description 方便内部组件知道自身是否需要更新的特殊属性
   * @type {string}
   */
  monitorId?: string;

  className?: string;

}