import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private http = inject(HttpClient);
  // Servidor local Node.js para salvar arquivos durante desenvolvimento
  private readonly fileServerUrl = 'http://localhost:3001/upload';
  
  /**
   * Salva a imagem localmente via servidor Node.js e retorna a URL
   */
  async saveImageLocally(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await firstValueFrom(
        this.http.post<{ path: string; message: string }>(this.fileServerUrl, formData)
      );
      
      console.log('✅ Imagem salva:', response.path);
      return response.path;
    } catch (error) {
      console.error('❌ Erro ao salvar imagem:', error);
      console.warn('⚠️  Certifique-se de que o file-server está rodando: node file-server.js');
      throw new Error('Falha ao salvar imagem. Verifique se o file-server está rodando.');
    }
  }

  /**
   * Valida se o arquivo é uma imagem válida
   */
  validateImage(file: File): { valid: boolean; error?: string } {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Formato inválido. Use JPG, PNG ou WEBP.'
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Arquivo muito grande. Máximo 5MB.'
      };
    }

    return { valid: true };
  }

  /**
   * Cria uma preview da imagem para exibição
   */
  createImagePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
