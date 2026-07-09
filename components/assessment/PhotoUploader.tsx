'use client';

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, X } from 'lucide-react';
import { validateFileSize, validateFileType } from '@/lib/validation';
import { Button } from '@/components/ui/button';

// ============================================================================
// Types
// ============================================================================

interface PhotoUploaderProps {
  label: string;
  photoUrl?: string;
  onPhotoChange: (photoData: { url: string; size: number; fileName: string } | null) => void;
  error?: string;
}

// ============================================================================
// Component
// ============================================================================

export function PhotoUploader({ label, photoUrl, onPhotoChange, error }: PhotoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | undefined>(error);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ============================================================================
  // File Processing
  // ============================================================================

  const processFile = async (file: File) => {
    setValidationError(undefined);

    // Validate file type
    const typeValidation = validateFileType(file);
    if (!typeValidation.isValid) {
      setValidationError(typeValidation.error);
      return;
    }

    // Validate file size
    const sizeValidation = validateFileSize(file);
    if (!sizeValidation.isValid) {
      setValidationError(sizeValidation.error);
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        onPhotoChange({
          url: result,
          size: file.size,
          fileName: file.name,
        });
      }
    };
    reader.onerror = () => {
      setValidationError('Failed to read file');
    };
    reader.readAsDataURL(file);
  };

  // ============================================================================
  // Event Handlers
  // ============================================================================

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPhotoChange(null);
    setValidationError(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ============================================================================
  // Render
  // ============================================================================

  const displayError = validationError || error;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      <div
        className={`relative border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
          isDragging
            ? 'border-primary bg-primary/5'
            : photoUrl
            ? 'border-gray-300'
            : displayError
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={photoUrl ? undefined : handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />

        {photoUrl ? (
          // Preview with remove button
          <div className="relative group">
            <img
              src={photoUrl}
              alt={label}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          // Upload zone
          <div className="p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop your photo here, or click to browse
            </p>
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG, WEBP up to 10MB
            </p>
          </div>
        )}
      </div>

      {displayError && (
        <p className="text-sm text-red-600">{displayError}</p>
      )}
    </div>
  );
}
