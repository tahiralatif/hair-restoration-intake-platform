'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PhotoUploader } from './PhotoUploader';
import { useAssessment } from '@/lib/contexts/AssessmentContext';
import { PatientPhotos, PhotoData, PhotoAngle } from '@/lib/types';
import { Alert } from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface PhotoUploadData {
  front?: PhotoData;
  top?: PhotoData;
  back?: PhotoData;
  left?: PhotoData;
  right?: PhotoData;
  closeup?: PhotoData;
}

// ============================================================================
// Constants
// ============================================================================

const PHOTO_ANGLES: Array<{ key: PhotoAngle; label: string }> = [
  { key: 'front', label: 'Front View' },
  { key: 'top', label: 'Top View' },
  { key: 'back', label: 'Back View' },
  { key: 'left', label: 'Left Side View' },
  { key: 'right', label: 'Right Side View' },
  { key: 'closeup', label: 'Close-up View' },
];

// ============================================================================
// Component
// ============================================================================

export function Step6PhotoUpload() {
  const { state, actions } = useAssessment();
  const [photos, setPhotos] = useState<PhotoUploadData>(state.formData.photos || {});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate progress
  const uploadedCount = Object.values(photos).filter(Boolean).length;
  const totalCount = PHOTO_ANGLES.length;
  const allPhotosUploaded = uploadedCount === totalCount;

  // ============================================================================
  // Effects
  // ============================================================================

  // Load existing photos from context
  useEffect(() => {
    if (state.formData.photos) {
      setPhotos(state.formData.photos);
    }
  }, [state.formData.photos]);

  // ============================================================================
  // Event Handlers
  // ============================================================================

  const handlePhotoChange = (angle: PhotoAngle, photoData: { url: string; size: number; fileName: string } | null) => {
    if (photoData) {
      const updatedPhotos = {
        ...photos,
        [angle]: {
          url: photoData.url,
          uploadedAt: new Date(),
          size: photoData.size,
          fileName: photoData.fileName,
        } as PhotoData,
      };
      setPhotos(updatedPhotos);
      
      // Clear error for this field
      if (errors[angle]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[angle];
          return newErrors;
        });
      }
    } else {
      // Remove photo
      const updatedPhotos = { ...photos };
      delete updatedPhotos[angle as keyof PhotoUploadData];
      setPhotos(updatedPhotos);
    }
  };

  const handleNext = () => {
    // Validate all photos are uploaded
    if (!allPhotosUploaded) {
      const newErrors: Record<string, string> = {};
      PHOTO_ANGLES.forEach(({ key, label }) => {
        if (!photos[key]) {
          newErrors[key] = `${label} is required`;
        }
      });
      setErrors(newErrors);
      return;
    }

    // Save to context and move to next step
    actions.updateStep(6, { photos: photos as PatientPhotos });
    actions.nextStep();
  };

  const handleBack = () => {
    // Save current progress even if incomplete
    actions.updateStep(6, { photos: photos as PatientPhotos });
    actions.previousStep();
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Upload Photos</h2>
        <p className="mt-2 text-sm text-gray-600">
          Please upload clear photos from all six angles. These photos help our doctors assess your hair loss pattern and create a personalized treatment plan.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-blue-900">
            Upload Progress
          </span>
          <span className="text-sm font-semibold text-blue-900">
            {uploadedCount} / {totalCount} photos
          </span>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(uploadedCount / totalCount) * 100}%` }}
          />
        </div>
        {allPhotosUploaded && (
          <div className="mt-2 flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-medium">All photos uploaded!</span>
          </div>
        )}
      </div>

      {/* Validation Error */}
      {Object.keys(errors).length > 0 && !allPhotosUploaded && (
        <Alert variant="destructive">
          <p className="font-medium">All six photos are required to proceed.</p>
          <p className="text-sm mt-1">Please upload photos for all angles.</p>
        </Alert>
      )}

      {/* Photo Uploaders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PHOTO_ANGLES.map(({ key, label }) => (
          <PhotoUploader
            key={key}
            label={label}
            photoUrl={photos[key]?.url}
            onPhotoChange={(photoData) => handlePhotoChange(key, photoData)}
            error={errors[key]}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          disabled={!allPhotosUploaded}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
