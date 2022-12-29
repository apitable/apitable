import * as React from 'react';
import styles from './style.module.less';
import { Tooltip } from '../common/tooltip';
import { useSelector } from 'react-redux';
import classnames from 'classnames';

export interface IOrganizationHeadProps {
  className?: string;
  hideTooltip?: boolean;
}

export const OrganizationHead: React.FC<IOrganizationHeadProps> = ({ className, hideTooltip = false }) => {
  const spaceName = useSelector(state => state.user.info?.spaceName);
  return (
    <div className={classnames(styles.organization, className)}>
      {
        hideTooltip
          ?
          <h2 className={styles.orgName}>
            {spaceName}
          </h2>
          :
          <Tooltip title={spaceName} textEllipsis>
            <h2 className={styles.orgName}>
              {spaceName}
            </h2>
          </Tooltip>
      }
    </div>
  );
};