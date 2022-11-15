import { useTheme } from '@apitable/components';

export const NodeSpectator = () => {
  const theme = useTheme();
  return <svg width="7" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      // eslint-disable-next-line max-len
      d="M0.758154 7.54292C0.424911 7.74383 0 7.50384 0 7.11472L0 0.885052C0 0.495981 0.424815 0.255987 0.758061 0.456794L5.92592 3.57085C6.24846 3.76521 6.24851 4.23288 5.92601 4.42731L0.758154 7.54292Z"
      fill={theme.color.fc3}
    />
  </svg>;
};