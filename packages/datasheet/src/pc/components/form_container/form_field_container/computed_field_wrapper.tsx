import { Tooltip } from 'antd';
import { useResponsive } from 'pc/hooks';
import { ScreenSize } from 'pc/components/common/component_display/component_display';
import { FC } from 'react';

interface IComputedFieldWrapperProps {
  title: string;
  className?: string;
}

export const ComputedFieldWrapper: FC<IComputedFieldWrapperProps> = props => {
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  return (
    <Tooltip trigger={isMobile ? 'click' : 'hover'} title={props.title}>
      <div className={props.className} style={{ width: '100%' }}>
        {props.children}
      </div>
    </Tooltip>
  );
};
