import { IUnitIds, IUnitMap, IUnitValue, IUserValue } from '@apitable/core';
import { IListBase } from '../list.interface';

export enum SourceType {
  Datasheet = 'Datasheet',
  Form = 'Form',
}

export interface IMemberOptionListProps extends IListBase<IUnitIds | null, (IUnitValue | IUserValue)[]> {
  /**
   * @description 是否要显示查看更多的按钮
   * 在 filter 中就不需要该按钮
   * @type {boolean}
   */
  showMoreTipButton: boolean;

  /**
   * @description 是否显示邀请成员的提示
   * @type {boolean}
   */
  showInviteTip?: boolean;

  /**
   * @description 由于该组件通用语 Member 和 CreatMember，这两个地方对于 id 的使用是不一致的，
   * 需要指定当前组件内使用哪种 id 作为主键。另外也可以根据该属性判断当前组件被谁调用
   * @type {('uuid' | 'unitId')}
   */
  uniqId: 'userId' | 'unitId';

  /**
   * @description 主要给 draft 编辑器使用，用来表示当前那个项目被聚焦
   * @type {number}
   */
  activeIndex?: number;

  /**
   * @description 是否显示搜索框，比如 Draft 中就不需要
   * @type {boolean}
   */
  showSearchInput: boolean;

  /**
   * 来源节点 id
   */
  sourceId: string;

  /**
   * 来源节点的类型
   */
  sourceType?: SourceType;

  unitMap: IUnitMap | null;

  linkId?: string;

  // 是否只展示member (否则可以选择member和group)
  memberOnly?: boolean;

  showTeams?: boolean;
  searchEmail?: boolean;
}
