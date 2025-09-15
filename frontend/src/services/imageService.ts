import axios from 'axios';
import AuthService from './auth.service';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Servizio per la gestione delle immagini
 */
export const imageService = {
  /**
   * Carica un'immagine sul server
   * @param file - Il file immagine da caricare
   * @returns Promise con l'URL dell'immagine caricata
   */
  async uploadImage(file: File): Promise<string> {
    // Crea un FormData per inviare il file
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = AuthService.getToken();
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token ? `Bearer ${token}` : ''
        }
      });

      return response.data.imageUrl;
    } catch (error) {
      console.error('Errore durante il caricamento dell\'immagine:', error);
      throw error;
    }
  },

  /**
   * Converte un'immagine base64 in un File
   * @param dataUrl - L'immagine in formato base64
   * @param filename - Il nome del file
   * @returns File - L'oggetto File creato
   */
  dataURLtoFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, { type: mime });
  }
};
