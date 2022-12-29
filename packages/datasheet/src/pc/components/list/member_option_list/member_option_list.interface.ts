import { IUnitIds, IUnitMap, IUnitValue, IUserValue } from '@apitable/core';
import { IListBase } from '../list.interface';

export enum SourceType {
  Datasheet = 'Datasheet',
  Form = 'Form',
}

export interface IMemberOptionListProps extends IListBase<IUnitIds | null, (IUnitValue | IUserValue)[]> {
  /**
   * @description Whether to display the View More button
   * The button is not needed in the filter
   * @type {boolean}
   */
  showMoreTipButton: boolean;

  /**
   * @description Whether to show tips for inviting members
   * @type {boolean}
   */
  showInviteTip?: boolean;

  /**
   * @description Due to the component's generic language Member and CreateBy, the use of ids in these two places is inconsistent.
   * It is necessary to specify which id is used as the primary key within the current component. 
   * You can also determine who is calling the current component based on this property
   * @type {('uuid' | 'unitId')}
   */
  uniqId: 'userId' | 'unitId';

  /**
   * @description Used primarily by the draft editor to indicate which item is currently in focus
   * @type {number}
   */
  activeIndex?: number;

  /**
   * @description Whether or not to show the search box, for example, in Draft is not required
   * @type {boolean}
   */
  showSearchInput: boolean;

  sourceId: string;

  sourceType?: SourceType;

  unitMap: IUnitMap | null;

  linkId?: string;

  // Whether to show only members (otherwise you can choose member and group)
  memberOnly?: boolean;

  showTeams?: boolean;
  searchEmail?: boolean;
}
