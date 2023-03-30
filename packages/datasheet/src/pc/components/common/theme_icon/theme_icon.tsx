import { useTheme, ThemeName } from '@apitable/components';

interface IThemeIconProps {
  lightIcon: JSX.Element;
  darkIcon: JSX.Element;
}

export const ThemeIcon: React.FC<IThemeIconProps> = (props) => {
  const theme = useTheme();

  if (theme.palette.type === ThemeName.Light) {
    return props.lightIcon;
  }
  return props.darkIcon;
};
