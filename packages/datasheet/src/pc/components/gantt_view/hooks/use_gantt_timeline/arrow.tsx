import { Arrow as KonvaArrow } from 'react-konva';

const Arrow = (props) => {
  const { _ref, ...rest } = props;
  return <KonvaArrow
    ref={_ref}
    {...rest}
  />;
};

export default Arrow;
