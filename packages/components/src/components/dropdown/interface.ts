import { IContextMenuItemProps } from '../context_menu';

export interface IDropdownProps {
  // Child elements
  children?: React.ReactNode;
  // Menu data
  data: IContextMenuItemProps[];
  // Primary key
  id: string;
  // Trigger event type
  trigger?: ('click' | 'contextMenu')[];
  // Whether should show arrow
  arrow?: boolean;
}