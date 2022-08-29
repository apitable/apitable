import * as React from 'react';
import { Typography, ITypographyProps, useThemeColors } from '@vikadata/components';
import { InformationLargeOutlined } from '@vikadata/icons';
import styles from './style.module.less';
import classNames from 'classnames';

interface IPopUpTitleProps extends Required<Pick<ITypographyProps, 'variant'>> {
  /**
   * @description 标题
   */
  title: string;

  /**
   * @description 右侧需要显示的内容，可以不传
   */
  rightContent?: JSX.Element;

  /**
   * @description 说明文档的地址，显示为一个 icon，紧跟在标题面
   */
  infoUrl?: string

  /**
   * @description 样式
   */
  className?: string;

  /**
   * @description 样式
   */
  style?: React.CSSProperties
}

export const PopUpTitle: React.FC<IPopUpTitleProps> = (props) => {
  const colors = useThemeColors();
  const { rightContent, title, variant, infoUrl, className, style } = props;
  return <div className={classNames(className, styles.popUpTitle)} style={style}>
    {/* 左侧的显示 */}
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
    {/* 支持自定义右侧的显示  */}
    {
      rightContent ? <div className={styles.rightPos}>{rightContent}</div> : null
    }
  </div>;
};
