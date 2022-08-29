import { ThemeName, useThemeColors } from '@vikadata/components';
import { getLanguage } from '@vikadata/core';
import { LogoPurpleFilled, LogoWhiteFilled } from '@vikadata/icons';
import classnames from 'classnames';
import * as React from 'react';
import LogoTextZhCN from 'static/icon/common/common_logo_text.svg';
import LogoTextEnUS from 'static/icon/common/common_logo_text_en_us.svg';
import styles from './styles.module.less';

const LogoSize = {
  mini: {
    logoSize: 16,
    logoTextHeight: 16
  },
  small: {
    logoSize: 24,
    logoTextHeight: 24
  },
  large: {
    logoSize: 32,
    logoTextHeight: 32
  }
};

interface ILogoProps {
  className?: string;
  text?: boolean,
  size?: 'mini' | 'small' | 'large',
  theme?: ThemeName;
}

export const LogoText: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = {
  'zh-CN': LogoTextZhCN,
  'en-US': LogoTextEnUS,
}[getLanguage()];

export const Logo: React.FC<ILogoProps> = (props) => {
  const colors = useThemeColors();

  const { size = 'small', text = true, className, theme } = props;
  const isLightTheme = theme === ThemeName.Light;
  const logoSize = LogoSize[size];
  return (
    <span className={classnames(styles.logo, className)}>
      <span style={{ width: logoSize.logoSize, height: logoSize.logoSize }}>
        {
          isLightTheme ? <LogoWhiteFilled color={colors.staticWhite0} size={logoSize.logoSize} /> :
            <LogoPurpleFilled color={colors.primaryColor} size={logoSize.logoSize} />
        }
      </span>

      {text && LogoText && <LogoText
        fill={isLightTheme ? colors.staticWhite0 : colors.primaryColor}
        width={undefined}
        height={logoSize.logoTextHeight}
      />}
    </span>
  );
};
