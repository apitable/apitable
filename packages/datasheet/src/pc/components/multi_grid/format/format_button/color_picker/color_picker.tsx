import { ButtonStyleType } from '@apitable/core';
import { ColorGroup, OptionSetting } from 'pc/components/common/color_picker';

interface IColorPickProps {
  color: number;
  onchange: (color: number) => void;
  options?: {
    content?: string;
    style?: ButtonStyleType,
  };
}

const arr = Array.from({ length: 9 }, (_item, index) => index + 1+ 40);
export const ColorPicker: React.FC<IColorPickProps> = (props) => {
  const { color, onchange } = props;

  const colorChange = (type: OptionSetting, id: string, value: string | number) => {
    onchange(value as number);
  };

  return (
    <ColorGroup
      options={props.options}
      option={{
        id: '',
        name: '',
        color: color,
      }}
      onChange={colorChange}
      colorGroup={ [40].concat(arr).concat([50])}
      itemStyle={{
        flex: '0 0 9%',
      }}
    />
  );
};
