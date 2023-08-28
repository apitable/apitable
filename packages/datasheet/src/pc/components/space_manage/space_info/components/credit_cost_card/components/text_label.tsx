interface ITextLabelProps {
  x?: number;
  y?: number;
  stroke?: string;
  value?: string;
}

export const TextLabel: React.FC<ITextLabelProps> = ({ x, y, stroke, value }) => {
  return (
    <text x={x} y={y} dy={-10} fill={stroke} fontSize={12} textAnchor="middle">
      {value}
    </text>
  );
};
