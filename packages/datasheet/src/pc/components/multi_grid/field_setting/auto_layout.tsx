import * as React from 'react';
import styles from './styles.module.less';
import { OPERATE_WIDTH } from '../field_setting';
import { useSelector } from 'react-redux';
import { Selectors } from '@apitable/core';

interface IAutoLayoutProps {
  boxWidth: number;
  datasheetId?: string;
}

function showLeftOrRight(positionX: number, boxWidth: number) {
  const windowWidth = document.body.clientWidth;
  if ((positionX + OPERATE_WIDTH + boxWidth) > windowWidth) {
    return {
      left: -boxWidth - 20,
    };
  } 
  return {
    right: -boxWidth - 20,
  };
  
}

export const AutoLayout: React.FC<IAutoLayoutProps> = props => {
  const { fieldRectLeft } = useSelector(state => Selectors.gridViewActiveFieldState(state, props.datasheetId));
  return (
    <div className={styles.autoLayout} style={showLeftOrRight(fieldRectLeft, props.boxWidth)}>
      {props.children}
    </div>
  );
};
