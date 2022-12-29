import { Box, Typography, useTheme } from '@apitable/components';

interface IErrorStacksProps {
  errorStacks?: { message: any }[];
}

export const ErrorStacks = (props: IErrorStacksProps) => {
  const theme = useTheme();
  return <Box
    marginTop="8px"
    padding="0 16px"
    boxShadow={`inset 1px 0px 0px ${theme.color.fc5}`}
  >
    {
      props.errorStacks?.map((error, index) => {
        return <Typography key={index} color={theme.color.red[500]} variant="body4">
          {error.message}
        </Typography>;
      })
    }
  </Box>;
};