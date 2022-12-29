import * as React from 'react';
import { Typography, ITypographyProps, useThemeColors } from '@apitable/components';
import { InformationLargeOutlined } from '@apitable/icons';
import styles from './style.module.less';
import classNames from 'classnames';

interface IPopUpTitleProps extends Required<Pick<ITypographyProps, 'variant'>> {
  /**
   * @description Title
   */
  title: string;

  /**
   * @description The content to be displayed on the right can be left out
   */
  rightContent?: JSX.Element;

  /**
   * @description The address of the description document, displayed as an icon, immediately above the title
   */
  infoUrl?: string

  /**
   * @description Format
   */
  className?: string;

  /**
   * @description Format
   */
  style?: React.CSSProperties
}

export const PopUpTitle: React.FC<IPopUpTitleProps> = (props) => {
  const colors = useThemeColors();
  const { rightContent, title, variant, infoUrl, className, style } = props;
  return <div className={classNames(className, styles.popUpTitle)} style={style}>
    {/* Left side of the display */}
    <div className={styles.leftPos}>
      <Typography variant={variant}>
        {title}
      </Typography>
      {
        infoUrl && <a
          href={infoUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <InformationLargeOutlined color={colors.thirdLevelText} />
        </a>
      }

    </div>
    {/* Support for customising the display on the right  */}
    {
      rightContent ? <div className={styles.rightPos}>{rightContent}</div> : null
    }
  </div>;
};
