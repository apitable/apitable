export const CustomCursor: React.FC<any> = (props) => {
  const { height } = props;
  //  top,left,right,bottom 是固定值，查看哪个点的数据都一样
  // right  是 y 周数据最左侧的点
  // left 是 y 轴坐标的位置
  // top, bottom 是 x 轴坐标的位置
  const { x, y } = props.points[0];
  // x 应该是当前这个点到左侧的距离
  const _width = 100;
  const halfWidth = Math.floor(_width / 2);
  return <rect fill="rgba(245, 245, 245, 0.61)" stroke="rgba(245, 245, 245, 0.61)" x={x - halfWidth} y={y} width={_width} height={height} />;
};
