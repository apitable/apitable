import { FC, ReactElement } from 'react';
import { Box } from '@apitable/components';

export const ListWithFooter: FC<{
  className?: string;
  padding?: string;
  footer: ReactElement;
  children: ReactElement;
}> = ({ footer, children, className, padding }) => {
  return (
    <>
      <Box overflow={'auto'} height={'100%'} flex={'1 1 auto'} className={className} padding={padding}>
        {children}
      </Box>
      {footer}
    </>
  );
};
