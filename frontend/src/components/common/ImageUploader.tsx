import React, { useState, useRef } from 'react';
import { imageService } from '../../services/imageService';
import { 
  Box, 
  Button, 
  Typography, 
  CircularProgress,
  IconButton,
  Paper
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

interface ImageUploaderProps {
  initialImage?: string;
  onImageChange: (imageUrl: string | null) => void;
  label?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  initialImage = '', 
  onImageChange,
  label = 'Immagine dell\'evento'
}) => {
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gestisce il click sul pulsante di upload
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Gestisce il cambiamento del file
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verifica il tipo di file
    if (!file.type.startsWith('image/')) {
      setError('Il file selezionato non è un\'immagine valida.');
      return;
    }

    // Verifica la dimensione del file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('L\'immagine deve essere inferiore a 5MB.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prima creiamo un'anteprima locale per un feedback immediato all'utente
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        const localPreview = event.target?.result as string;
        setImage(localPreview); // Mostra subito l'anteprima locale
        
        try {
          // Tenta di caricare l'immagine sul server
          const uploadedUrl = await imageService.uploadImage(file);
          setImage(uploadedUrl);
          onImageChange(uploadedUrl);
        } catch (uploadError) {
          console.error('Errore durante il caricamento sul server:', uploadError);
          // Se il caricamento sul server fallisce, usiamo comunque l'anteprima locale
          // e informiamo l'utente che è solo temporanea
          onImageChange(localPreview);
          setError('L\'immagine è visibile solo in anteprima. Il caricamento sul server non è riuscito.');
        } finally {
          setLoading(false);
        }
      };
      
      reader.onerror = () => {
        setError('Si è verificato un errore durante la lettura del file.');
        setLoading(false);
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Si è verificato un errore durante il caricamento dell\'immagine.');
      setLoading(false);
    }
  };

  // Gestisce la rimozione dell'immagine
  const handleRemoveImage = () => {
    setImage(null);
    onImageChange(null);
    // Reset del campo input file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        {label}
      </Typography>
      
      {image ? (
        <Box sx={{ position: 'relative' }}>
          <Paper 
            elevation={2}
            sx={{ 
              p: 1,
              borderRadius: 1,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box
              component="img"
              src={image}
              alt="Anteprima immagine"
              sx={{
                width: '100%',
                height: 200,
                objectFit: 'cover',
                borderRadius: 1,
              }}
            />
            <IconButton
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.7)',
                }
              }}
              onClick={handleRemoveImage}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Paper>
        </Box>
      ) : (
        <Button
          variant="outlined"
          component="label"
          startIcon={loading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
          onClick={handleButtonClick}
          disabled={loading}
          sx={{ 
            width: '100%',
            height: 200,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 1,
            p: 2
          }}
        >
          <AddPhotoAlternateIcon sx={{ fontSize: 48, mb: 1, color: 'text.secondary' }} />
          <Typography variant="body1" color="text.secondary">
            {loading ? 'Caricamento in corso...' : 'Carica un\'immagine'}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            Formati supportati: JPG, PNG, GIF (max 5MB)
          </Typography>
        </Button>
      )}
      
      {error && (
        <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
          {error}
        </Typography>
      )}
      
      {/* Input file nascosto */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
    </Box>
  );
};

export default ImageUploader;
