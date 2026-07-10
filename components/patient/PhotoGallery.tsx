'use client';

import React, { useState } from 'react';
import { PatientPhotos } from '@/lib/types';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface PhotoGalleryProps {
  photos: PatientPhotos;
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  
  const photoEntries = Object.entries(photos).filter(([_, data]) => data?.url);
  const currentIndex = photoEntries.findIndex(([_, data]) => data.url === selectedPhoto);

  const handleNext = () => {
    if (currentIndex < photoEntries.length - 1) {
      setSelectedPhoto(photoEntries[currentIndex + 1][1].url);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedPhoto(photoEntries[currentIndex - 1][1].url);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photoEntries.map(([angle, data]) => (
          <div key={angle} className="relative group cursor-pointer" onClick={() => setSelectedPhoto(data.url)}>
            <img src={data.url} alt={angle} className="w-full h-48 object-cover rounded-lg" />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-sm p-2 rounded-b-lg">
              {angle.charAt(0).toUpperCase() + angle.slice(1)}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl">
          <div className="relative">
            <img src={selectedPhoto || ''} alt="Full size" className="w-full h-auto" />
            <div className="absolute top-1/2 left-4 right-4 flex justify-between">
              <Button
                variant="secondary"
                size="icon"
                onClick={handlePrev}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={handleNext}
                disabled={currentIndex === photoEntries.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
