import { useState } from 'react';
import * as React from 'react';
import { IFieldProps } from '../../../interface';
import { IHelp, titleLevel, HelpIconButton, SuffixIcon, DropIcon } from './style';

export const TitleField = (props: Pick<IFieldProps, 'id' | 'title' | 'required'> & {
  help?: IHelp;
  hasCollapse?: boolean;
  defaultCollapse?: boolean;
  onChange?: (collapse: boolean) => void;
  style?: React.CSSProperties;
}) => {
  const { title, id, help, hasCollapse, style, defaultCollapse = false, onChange } = props;
  const [, level] = (id || '').split('-');
  const TitleComponent = titleLevel[Math.min(parseInt(level, 10) || 0, 2)];
  const [collapse, setCollapse] = useState<boolean>(defaultCollapse);

  const switchCollapse = () => {
    if (!hasCollapse) return;
    const newValue = !collapse;
    setCollapse(newValue);
    onChange && onChange(newValue);
  };

  return <TitleComponent style={style} id={id} hasCollapse={hasCollapse} onClick={switchCollapse}>
    {title}
    {help && <HelpIconButton help={help} />}
    {hasCollapse && <SuffixIcon isIconRotate={!collapse}> <DropIcon color="#8C8C8C" /></SuffixIcon>}
  </TitleComponent>;
};