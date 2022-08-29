import { CloseLargeOutlined, DefaultFilled, ErrorFilled, SuccessFilled, WarnFilled } from '@vikadata/icons';
import { Box, IconButton, Typography } from 'components';
import { useProviderTheme } from 'hooks';
import React, { useState } from 'react';
import { IAlertProps } from './interface';
import { AlertInner, AlertWrapper } from './styled';

export const Alert = (
  {
    type = 'default',
    title,
    content,
    closable = false,
    onClose,
    style
  }: IAlertProps) => {

  const [hidden, setHidden] = useState(false);
  const theme = useProviderTheme();
  const iconMap = {
    default: DefaultFilled,
    error: ErrorFilled,
    warning: WarnFilled,
    success: SuccessFilled,
  };

  const Icon = iconMap[type];
  const AlertInnerComponent = title ? AlertInner : React.Fragment;
  const iconSize = title ? 24 : 16;

  const handleClose = () => {
    setHidden(true);
    onClose && onClose();
  };
  if (hidden) {
    return null;
  }
  return (
    <AlertWrapper title={title} type={type} style={style}>
      <AlertInnerComponent>
        <Icon size={iconSize} />
        <Box
          display="flex" flexDirection="column"
          justifyContent="center" alignItems="flex-start"
          mx="4px"
          width="100%"
        >
          {title && <Typography variant="h7"> {title} </Typography>}
          <div style={{ marginTop: title ? 4 : 0 }}>
            <Typography variant="body3" color={title ? theme.color.fill0 : theme.color.primaryColor}> {content} </Typography>
          </div>
        </Box>
        {closable && <IconButton size={'small'} onClick={handleClose} icon={CloseLargeOutlined} />}
      </AlertInnerComponent>
    </AlertWrapper>
  );
};