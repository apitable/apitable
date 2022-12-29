export interface IListBase<T, L> {
  /**
   * @description Existing data
   * For cell, it is cellValue
   * For filter, this is filterValue
   * @type {(IUnitIds | null)}
  */
  existValues: T;

  /**
   * @description Click callbacks for each option in the dropdown box
   * @param {T} value
   */
  onClickItem (value: T): void;

  /**
   * @description Mark whether the current mode is single-select or multi-select
   * @type {boolean}
   */
  multiMode: boolean;

  /**
   * @description The data to be displayed in the drop-down list, if not passed in, will use the data stored in the memberStash class
   * @type {L}
   */
  listData?: L;

  /**
   * @description Special properties that make it easy for internal components to know if they need to be updated
   * @type {string}
   */
  monitorId?: string;

  className?: string;

}