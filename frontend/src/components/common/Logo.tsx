import React from 'react';
import { Typography, Box } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';

interface LogoProps {
  variant?: 'default' | 'light';
  size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ variant = 'default', size = 'medium' }) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return { icon: 24, text: '1.2rem' };
      case 'large':
        return { icon: 40, text: '2rem' };
      default:
        return { icon: 32, text: '1.5rem' };
    }
  };

  const sizeObj = getSize();
  const color = variant === 'light' ? '#FFFFFF' : 'primary';

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <EventIcon sx={{ fontSize: sizeObj.icon, color }} />
      <Typography
        variant="h6"
        component="div"
        sx={{
          fontWeight: 700,
          fontSize: sizeObj.text,
          color,
          letterSpacing: '0.5px',
        }}
      >
        Eventify
      </Typography>
    </Box>
  );
};

export default Logo;
