/**
 * Gondal Clothes House - Media Service
 * Scalable media upload, validation, compression & preview engine
 */

import { ProductMediaItem } from '../types';
import { ValidationService } from './validationService';

export class MediaService {
  /**
   * Validates a media file
   */
  static validateFile(file: File) {
    return ValidationService.validateMediaFile({
      type: file.type,
      size: file.size,
      name: file.name,
    });
  }

  /**
   * Reads a File and converts to Data URL (base64 string)
   */
  static fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read media file.'));
        }
      };
      reader.onerror = () => reject(new Error('File reading error occurred.'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Converts a File to a managed ProductMediaItem
   */
  static async processUploadedFile(
    file: File,
    options?: { isMain?: boolean; altText?: string; sortOrder?: number }
  ): Promise<{ success: boolean; mediaItem?: ProductMediaItem; error?: string }> {
    const validation = this.validateFile(file);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    try {
      const dataUrl = await this.fileToDataUrl(file);
      const mediaId = 'med_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

      const mediaItem: ProductMediaItem = {
        id: mediaId,
        type: validation.mediaType === 'video' ? 'video' : 'image',
        url: dataUrl,
        thumbnailUrl: validation.mediaType === 'image' ? dataUrl : undefined,
        altText: options?.altText || file.name.replace(/\.[^/.]+$/, ''),
        isMain: options?.isMain ?? false,
        sortOrder: options?.sortOrder ?? 0,
        sizeBytes: file.size,
        mimeType: file.type,
      };

      return { success: true, mediaItem };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Failed to process media file.',
      };
    }
  }

  /**
   * Batch process multiple media files
   */
  static async processMultipleFiles(
    files: File[]
  ): Promise<{ items: ProductMediaItem[]; errors: string[] }> {
    const items: ProductMediaItem[] = [];
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const result = await this.processUploadedFile(file, {
        sortOrder: i,
        isMain: i === 0,
      });

      if (result.success && result.mediaItem) {
        items.push(result.mediaItem);
      } else if (result.error) {
        errors.push(`${file.name}: ${result.error}`);
      }
    }

    return { items, errors };
  }
}
