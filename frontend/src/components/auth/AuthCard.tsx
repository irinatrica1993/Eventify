import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import Logo from '../common/Logo';

interface AuthCardProps {
  title: string;
  children: React.ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({ title, children }) => {
  return (
    <Card
      sx={{
        maxWidth: 450,
        width: '100%',
        p: 3,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        borderRadius: 3,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Logo size="medium" />
        <Typography variant="h5" component="h1" sx={{ mt: 2, fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
      <CardContent sx={{ p: 0 }}>{children}</CardContent>
    </Card>
  );
};

export default AuthCard;
