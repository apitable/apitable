import * as React from 'react';
import { Box, Typography, useTheme } from '@vikadata/components';

interface IKeyValueDisplayProps {
  label: string;
  value: any;
  
}

export const KeyValueDisplay = (props: IKeyValueDisplayProps) => {
  const { label, value } = props;
  const theme = useTheme();
  if (!value) return null;
  return <Box>
    <Typography variant="body3" color={theme.color.fc1}>
      {label}
    </Typography>
    <Typography variant="body4" color={theme.color.fc2}>
      {
        typeof value === 'object' ? JSON.stringify(value, null, '\t') : value.toString()
      }
    </Typography>
  </Box>;
};

interface IStyledTitleProps {
  hasError?: boolean;
}
export const StyledTitle = (props: React.PropsWithChildren<IStyledTitleProps>) => {
  const theme = useTheme();
  return <Box display="flex" alignItems="center">
    <Box
      height="12px"
      width="2px"
      backgroundColor={props.hasError ? theme.color.fc10 : theme.color.fc0}
      marginRight="4px"
    />
    <Typography variant="body2" color={props.hasError ? theme.color.fc10 : theme.color.fc1}>
      {props.children}
    </Typography>
  </Box>;
};