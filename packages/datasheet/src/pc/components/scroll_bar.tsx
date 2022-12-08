import { Scrollbars } from 'react-custom-scrollbars';
import { FC } from 'react';
import * as React from 'react';
import { useHover } from 'ahooks';
interface ICustomScrollbarsProps {
  onScroll?: (e) => void;
  style?: React.CSSProperties;
}
export const ScrollBar: FC<ICustomScrollbarsProps> = (props) => {
  const ref = React.useRef(null);
  const isHovering = useHover(ref);

  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      borderRadius: 6,
      backgroundColor: 'rgba(191, 193, 203, 0.5)',
      zIndex: 1,
      opacity: isHovering ? '1' : '0',
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };
  return (
    <Scrollbars
      renderThumbHorizontal={renderThumb}
      renderThumbVertical={renderThumb}
      autoHideTimeout={500}
      autoHideDuration={200} 
      {...props}
    > 
      <div ref={ref} style={props.style}>
        {props.children}
      </div>      
    </Scrollbars>
  );
};