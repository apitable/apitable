import { FC, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import cls from 'classnames';

import { Typography } from '@vikadata/components';
import { SelectOutlined } from '@vikadata/icons';
import { IDropdown } from './interface';

import styles from './style.module.less';

export const Dropdown: FC<IDropdown> = ({
  mode = 'common',
  className,
  data,
  value,
  visible,
  selectedMode = 'icon',
  divide,
  renderItem,
}) => {
  const renderAvatar = (avatar: string | ReactNode) => {
    if (typeof avatar === 'string') {
      return <img src={avatar} alt="" />;
    }
    return avatar;
  };

  const renderNode = (
    <div
      className={cls(styles.dropdown, className)}
    >
      {
        data.map((item, i) => {
          const selectedItem = value.find((v) => item.value === v);
          if (renderItem) {
            return renderItem(item);
          }
          return (
            <>
              <div key={item.value} className={cls(styles.dropdownItem, { [styles.dropdownItemSelected]: Boolean(selectedItem) })}>
                {selectedMode === 'check' && (
                  <div className={styles.dropdownItemCheckSelected} />
                )}
                {renderAvatar(item.avatar)}
                <div className={styles.dropdownItemContent}>
                  <div className={styles.dropdownItemLabel}>
                    <Typography variant='body2' className={styles.dropdownItemLabelText}>{item.label}</Typography>
                    {item.labelTip && <div className={styles.dropdownItemLabelTip}>{item.labelTip}</div>}
                  </div>
                  {item.describe && <Typography variant='body4' className={styles.dropdownItemDescribe}>{item.describe}</Typography>}
                </div>
                {item.extra && <div className={styles.dropdownItemExtra}>{item.extra}</div>}
                {selectedMode === 'icon' && (
                  <div className={styles.dropdownItemIconSelected}>
                    <SelectOutlined />
                  </div>
                )}
              </div>
              {divide && i !== data.length - 1 && <div className={styles.dropdownDivide} />}
            </>
          );
        })
      }
    </div>
  );

  const mergeCls = cls(styles.dropdown, { [styles.dropdownVisible]: visible });

  if (mode === 'global') {
    const containerNode = (
      <div>
        {renderNode}
      </div>
    );
    return ReactDOM.createPortal(containerNode, document.body);
  }

  return renderNode;
};