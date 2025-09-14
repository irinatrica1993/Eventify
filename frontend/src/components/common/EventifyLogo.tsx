import React from 'react';
import { Box, Typography, SxProps, Theme } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';

interface EventifyLogoProps {
  size?: 'small' | 'medium' | 'large';
  sx?: SxProps<Theme>;
}

const EventifyLogo: React.FC<EventifyLogoProps> = ({ size = 'medium', sx = {} }) => {
  // Dimensioni in base alla variante
  const logoSizes = {
    small: {
      fontSize: '1.5rem',
      iconSize: 24,
    },
    medium: {
      fontSize: '2rem',
      iconSize: 32,
    },
    large: {
      fontSize: '2.5rem',
      iconSize: 40,
    },
  };

  const { fontSize, iconSize } = logoSizes[size];

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        ...sx 
      }}
    >
      <EventIcon 
        sx={{ 
          fontSize: iconSize, 
          mr: 1, 
          color: 'primary.main' 
        }} 
      />
      <Typography 
        variant="h4" 
        component="span" 
        sx={{ 
          fontSize, 
          fontWeight: 500, 
          letterSpacing: 1,
          fontFamily: '"Montserrat", sans-serif',
          textTransform: 'uppercase',
          color: 'text.primary',
        }}
      >
        Eventify
      </Typography>
    </Box>
  );
};

export default EventifyLogo;
