import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  InputAdornment, 
  IconButton,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, Google as GoogleIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RegisterForm: React.FC = () => {
  const { register, loginWithGoogle, error, isLoading, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  const validateForm = () => {
    if (password !== confirmPassword) {
      setPasswordError('Le password non corrispondono');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('La password deve contenere almeno 6 caratteri');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await register({ name, email, password });
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }} 
          onClose={clearError}
        >
          {error}
        </Alert>
      )}
      
      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        label="Nome completo"
        name="name"
        autoComplete="name"
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isLoading}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        id="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
        error={!!passwordError}
        helperText={passwordError ? passwordError : 'Minimo 6 caratteri'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        name="confirmPassword"
        label="Conferma password"
        type={showPassword ? 'text' : 'password'}
        id="confirmPassword"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        disabled={isLoading}
        error={!!passwordError}
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2, py: 1.2 }}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Registrati'}
      </Button>
      
      <Divider sx={{ my: 2 }}>oppure</Divider>
      
      <Button
        fullWidth
        variant="outlined"
        startIcon={<GoogleIcon />}
        onClick={loginWithGoogle}
        sx={{ mb: 2, py: 1.2 }}
        disabled={isLoading}
      >
        Registrati con Google
      </Button>
      
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2">
          Hai già un account?{' '}
          <Typography
            component={RouterLink}
            to="/login"
            variant="body2"
            color="primary"
            sx={{ fontWeight: 600, textDecoration: 'none' }}
          >
            Accedi
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
};

export default RegisterForm;
