'use client';

import { useState, useEffect } from 'react';

export interface Field {
  id: string;
  name: string;
  type: 'text';
}

export interface Photo {
  id: string;
  filename: string;
  uploadDate: string;
  imageUrl: string;
  extractedData: Record<string, string>;
  rawText: string;
}

export function usePhotoStore() {
  const [fields, setFields] = useState<Field[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedFields = localStorage.getItem('photo-extractor-fields');
    const savedPhotos = localStorage.getItem('photo-extractor-photos');

    if (savedFields) {
      try {
        setFields(JSON.parse(savedFields));
      } catch (error) {
        console.error('Failed to load fields from localStorage:', error);
      }
    }

    if (savedPhotos) {
      try {
        setPhotos(JSON.parse(savedPhotos));
      } catch (error) {
        console.error('Failed to load photos from localStorage:', error);
      }
    }
  }, []);

  // Save fields to localStorage when changed
  useEffect(() => {
    localStorage.setItem('photo-extractor-fields', JSON.stringify(fields));
  }, [fields]);

  // Save photos to localStorage when changed
  useEffect(() => {
    localStorage.setItem('photo-extractor-photos', JSON.stringify(photos));
  }, [photos]);

  const addPhoto = (photo: Photo) => {
    setPhotos(prev => [photo, ...prev]);
  };

  const updatePhoto = (id: string, updates: Partial<Photo>) => {
    setPhotos(prev => 
      prev.map(photo => 
        photo.id === id ? { ...photo, ...updates } : photo
      )
    );
  };

  const deletePhoto = (id: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  };

  return {
    fields,
    setFields,
    photos,
    addPhoto,
    updatePhoto,
    deletePhoto,
  };
}