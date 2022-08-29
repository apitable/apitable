import {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  ForwardRefRenderFunction,
} from 'react';
import { useSize } from 'ahooks';
import { Select, TextInput, ITextInputProps, IOption } from '@vikadata/components';
import { SystemConfig, t, Strings } from '@vikadata/core';
import { PhonenumberFilled } from '@vikadata/icons';
import styles from './style.module.less';

// 区号和城市集合
const countryAndPhoneAreaCode = SystemConfig.country_code_and_phone_code;
// 将数据转换为Select组件所需的数据结构
const optionData = (() => {
  const tempArr: { value: string, label: string }[] = [];
  for (const country in countryAndPhoneAreaCode) {
    const areaCode = countryAndPhoneAreaCode[country].phoneCode;
    tempArr.push({
      value: `+${areaCode}`,
      label: `${t(Strings[country])}（+${areaCode}）`
    });
  }
  return tempArr;
})();

export interface IPhoneInputRefProps {
  focus: () => void
}

export interface IPhoneInputProps extends Omit<ITextInputProps, 'onChange'> {
  // 默认区号
  defaultAreaCode?: string;
  // 区号或手机号改变时触发
  onChange?: (areaCode: string, phone: string) => void;
}

export const PhoneInputBase: ForwardRefRenderFunction<any, IPhoneInputProps> = ({
  className,
  onChange,
  defaultAreaCode = '+86',
  ...rest
}, ref) => {
  // 区号
  const [areaCode, setAreaCode] = useState(defaultAreaCode);
  // 手机号
  const [phone, setPhone] = useState('');
  const inputWrapperRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const size = useSize(inputWrapperRef);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));

  const handleOptionSelected = (option: IOption) => {
    const value = option.value as string;
    onChange && onChange(value, phone);
    setAreaCode(value);
  };

  const handlePhoneChange = e => {
    const value = e.target.value.trim();
    onChange && onChange(areaCode, value);
    setPhone(value);
  };

  // 区号选择
  const PhoneCodeSelect = () => {
    return (
      <Select
        triggerCls={styles.areaCodeSelect}
        listCls="light"
        maxListWidth={500}
        options={optionData}
        value={areaCode}
        onSelected={handleOptionSelected}
        dropdownMatchSelectWidth={false}
        listStyle={{ width: size?.width }}
        renderValue={option => option.value.toString()}
      />
    );
  };

  return (
    <TextInput
      ref={inputRef}
      wrapperRef={inputWrapperRef}
      className={styles.phoneInput}
      placeholder={t(Strings.placeholder_input_mobile)}
      addonBefore={<>
        <PhoneCodeSelect />
        <div className={styles.line} />
      </>}
      prefix={<PhonenumberFilled />}
      onChange={handlePhoneChange}
      {...rest}
    />
  );
};

export const PhoneInput = forwardRef(PhoneInputBase);
