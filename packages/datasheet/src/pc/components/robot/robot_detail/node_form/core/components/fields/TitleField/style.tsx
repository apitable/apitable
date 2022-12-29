import { InformationSmallOutlined } from '@apitable/icons';
import { Tooltip } from '@apitable/components';
import styles from './style.module.less';

export interface IHelp {
  text: string;
  url: string
}

//  TODO: Here the tooltips component is missing, hovering over the icon should show helpText
export const HelpIconButton = ({ help }: { help: IHelp }) => {
  if (!help) return null;
  return (
    <Tooltip content={help.text}>
      <a
        href={help.url}
        rel="noopener noreferrer"
        style={{ marginLeft: 4 }}
        target='_blank'>
        <InformationSmallOutlined className={styles.helpIcon} color="#8c8c8c" />
      </a>
    </Tooltip>
  );
};