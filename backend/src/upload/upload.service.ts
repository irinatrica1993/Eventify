import { Injectable } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class UploadService {
  /**
   * Ottiene l'URL pubblico di un file caricato
   * @param filename Nome del file
   * @returns URL del file
   */
  getFileUrl(filename: string): string {
    // Costruisci l'URL relativo per accedere al file
    return `http://localhost:3000/uploads/${filename}`;
  }
}
