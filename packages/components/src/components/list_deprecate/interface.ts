import { IUseListenTriggerInfo } from 'helper';
import { HTMLAttributes, ReactElement, ReactNode } from 'react';

export interface IListDeprecateProps {

  /**
   * Child element
   */
  children: ReactElement[];

  /**
   * click handler
   */
  onClick(e: React.MouseEvent | null, index: number): void

  /**
   * Tips when data is empty
   */
  noDataTip?: string | (() => ReactNode)

  /**
   * Footer components
   */
  footerComponent?: () => ReactNode;

  className?: string;
  style?: React.CSSProperties

  /**
   * The position of the item currently being focused
   */
  activeIndex?: number

  searchProps?: ISearchProps

  triggerInfo?: IUseListenTriggerInfo;

  autoHeight?: boolean;
}

export interface IListItemProps extends HTMLAttributes<HTMLDivElement> {

  /**
   * Current option index
   */
  currentIndex: number;

  /**
   * Wrapper component
   */
  wrapperComponent?(children: ReactNode): ReactNode

  disabled?: boolean;
}

export interface ISearchProps {
  /**
   *  Input reference
   */
  inputRef?: React.RefObject<HTMLInputElement>;

  /**
   * Custom inline styles
   */
  style?: React.CSSProperties

  /**
   * Input placeholder
   */
  placeholder?: string

  /**
   * @description input enter event callback
   * @param {() => void} clearKeyword is the processing function passed in from the component, 
   * where you can process some operations inside the component
   */
  onInputEnter?(clearKeyword: () => void): void

  /**
   * @description Search input callback
   * @param {React.ChangeEvent} e
   * @param {string} keyword
   */
  onSearchChange?(e: React.ChangeEvent, keyword: string): void
}
