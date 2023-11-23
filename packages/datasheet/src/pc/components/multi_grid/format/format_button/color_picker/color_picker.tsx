import { ColorGroup, OptionSetting } from 'pc/components/common/color_picker';

interface IColorPickProps {
  color: number;
  onchange: (color: number) => void;
  options?: {
    content?: string;
  };
}

export const ColorPicker: React.FC<IColorPickProps> = (props) => {
  const { color, onchange } = props;

  const colorChange = (type: OptionSetting, id: string, value: string | number) => {
    onchange(value as number);
  };

  return (
    <>
      <ColorGroup
        options={props.options}
        option={{
          id: '',
          name: '',
          color: color,
        }}
        onChange={colorChange}
        colorGroup={[50].concat(Array.from({ length: 10 }, (_item, index) => index + 40))}
        itemStyle={{
          flex: '0 0 9%',
        }}
      />
    </>
  );
};
