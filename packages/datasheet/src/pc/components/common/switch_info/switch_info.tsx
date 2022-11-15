import { ISwitchProps, Switch } from '@apitable/components';
import { PermissionType, IPermissionInfo } from 'pc/components/space_manage/security';
import { SubscribeGrade, SubscribeLabel } from 'pc/components/subscribe_system/subscribe_label/subscribe_label';
import { FC } from 'react';
import styles from './style.module.less';
import classNames from 'classnames';
import { Radio, Tooltip } from 'antd';

interface ISwitchInfoProps extends ISwitchProps {
  switchText: string;
  tipContent: string;
  loading?: boolean;
  grade?: SubscribeGrade;
  permissionType?: PermissionType;
  permissionList?: IPermissionInfo[];
  onClick?: (value) => void;
}

export const SwitchInfo: FC<ISwitchInfoProps> = props => {
  const { tipContent, switchText, loading = false, style, grade, permissionType = PermissionType.Readable, permissionList = [], ...rest } = props;
  const arr = tipContent.split('；');
  const checked = props.checked;
  return (
    <div className={styles.switchInfo} style={style}>
      <div className={styles.switchInfoTop}>
        <Switch
          {...rest}
          size="small"
          loading={loading}
        />
        <span className={styles.switchText}>{switchText}</span>
        {
          grade && <SubscribeLabel grade={grade} />
        }
      </div>
      <div>
        <ul>
          {arr.map(item => <li key={item}>{item}</li>)}
        </ul>
      </div>
      {
        Boolean(permissionList.length) &&
        <div className={classNames(styles.radioGroup, !checked && styles.radioGroupDisabled)}>
          <Radio.Group
            name="inline"
            onChange={(e) => props.onClick?.(e.target.value)}
            value={String(permissionType)}
            disabled={!checked}
          >
            {
              permissionList.map(item => {
                const { name, value, disableTip } = item;
                const isCurrent = String(value) === String(permissionType);
                const radioComponent = (
                  <Radio key={value} value={String(value)}>
                    <span
                      className={classNames({
                        [styles.radioText]: checked,
                        [styles.radioTextSelected]: checked && isCurrent
                      })}
                    >
                      {name}
                    </span>
                  </Radio>
                );
                return (
                  checked && disableTip ?
                    <Tooltip title={disableTip} key={value}>
                      <span className={styles.radioWrapper}>
                        {radioComponent}
                      </span>
                    </Tooltip> :
                    radioComponent
                );
              })
            }
          </Radio.Group>
        </div>
      }
    </div>
  );
};
