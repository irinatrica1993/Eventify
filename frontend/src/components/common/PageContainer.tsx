import React from 'react';
import { Container, Box } from '@mui/material';
import { ContainerProps } from '@mui/material/Container';

interface PageContainerProps {
  maxWidth?: ContainerProps['maxWidth'];
  children: React.ReactNode;
  sx?: any;
}

const PageContainer: React.FC<PageContainerProps> = ({
  maxWidth = 'lg',
  children,
  ...rest
}) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 4,
        display: 'flex',
        flexDirection: 'column',
      }}
      {...rest}
    >
      <Container maxWidth={maxWidth}>{children}</Container>
    </Box>
  );
};

export default PageContainer;
