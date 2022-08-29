import { IContextMenuData } from '../context_menu';

export interface IDropdownProps {
  // 子元素
  children?: React.ReactNode;
  // menu 数据集合
  data: IContextMenuData[];
  // 唯一标识
  id: string;
  // 触发方式
  trigger?: ('click' | 'contextMenu')[];
  // 是否展示箭头
  arrow?: boolean;
}