interface ITextLabelProps {
  x?: number;
  y?: number;
  stroke?: string;
  value?: string;
  color: string;
}

export const TextLabel: React.FC<ITextLabelProps> = ({ x, y, color, value }) => {
  return (
    <text x={x} y={y} dy={-10} fill={color} fontSize={12} textAnchor="middle">
      {value}
    </text>
  );
};
