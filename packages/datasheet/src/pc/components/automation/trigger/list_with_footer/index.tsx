import { FC, ReactElement } from 'react';
import { Box } from '@apitable/components';

export const ListWithFooter: FC<{
    className?: string
    footer: ReactElement
    children: ReactElement
}> = ({ footer, children, className }) => {

  return (
    <>
      <Box overflow={'auto'} height={'100%'} flex={'1 1 auto'} className={className}>
        {
          children
        }
      </Box>
      {footer}
    </>
  );
};