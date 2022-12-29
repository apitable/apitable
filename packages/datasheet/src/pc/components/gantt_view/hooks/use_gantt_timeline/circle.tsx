import { Circle as KonvaCircle } from 'react-konva';

const Circle = (props) => {
  const { _ref, ...rest } = props;
  return <KonvaCircle
    ref={_ref}
    {...rest}
  />;
};

export default Circle;
