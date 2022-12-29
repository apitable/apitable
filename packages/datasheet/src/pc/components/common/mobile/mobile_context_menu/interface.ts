import * as React from 'react';

export interface IMobileContextMenuProps {
  visible: boolean;

  /**
   * @description There will be a title
   */
  title: React.ReactNode;

  /**
   * @description Data to be displayed
   */
  data: any;

  /**
   * @description Callbacks for closure
   */
  onClose: () => void;

  /**
   * @description hidden or disabled may be functions, where some parameters can be customized
   */
  params?: {
    [key: string]: any
  }

  /**
   * @description Display height
   * @default 90%(90% of the height of the phone screen）
   */
  height?: string;
}
