import React, { ReactNode } from 'react';
import { Paper, Typography, Box, SxProps, Theme } from '@mui/material';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  iconColor?: string;
  sx?: SxProps<Theme>;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  icon,
  iconColor = 'primary',
  sx = {},
}) => {
  return (
    <Paper
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: 200,
        borderRadius: 2,
        border: '1px solid #f0f0f0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 8px 15px rgba(0,0,0,0.08)',
        },
        ...sx,
      }}
    >
      <Box sx={{ color: iconColor, fontSize: 60, mb: 2 }}>{icon}</Box>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        {title}
      </Typography>
      <Typography variant="body1" align="center">
        {description}
      </Typography>
    </Paper>
  );
};

export default DashboardCard;
