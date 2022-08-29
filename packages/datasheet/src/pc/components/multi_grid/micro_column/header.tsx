import { IField } from '@vikadata/core';
import { useThemeColors } from '@vikadata/components';
import { FC } from 'react';
import { getFieldTypeIcon } from '../field_setting';
import styles from './styles.module.less';

interface IHeaderProps {
  field: IField;
}

export const Header: FC<IHeaderProps> = props => {
  const colors = useThemeColors();
  const {
    field,
  } = props;

  return (
    <div className={styles.head}>
      <div className={styles.iconType}>
        {getFieldTypeIcon(field.type, colors.secondLevelText)}
      </div>
      <div className={styles.fieldName}>
        {field.name}
      </div>
    </div>
  );
};
