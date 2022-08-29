import { Stage as KonvaStage } from 'react-konva';

const Stage = (props) => {
  const { children, _ref, ...rest } = props;

  return <KonvaStage ref={_ref} {...rest}>
    {children}
  </KonvaStage>;
};

export default Stage;
