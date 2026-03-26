'use client';

import { Warning } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Ban, Download, X, Calendar, User, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

// Format date to show only date without time
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

interface WarningDetailProps {
  warning: Warning | null;
  isOpen: boolean;
  onClose: () => void;
  storeName?: string;
}

export function WarningDetail({ warning, isOpen, onClose, storeName }: WarningDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!warning) return null;

  // Get all images (from new imageUrls array or fallback to legacy imageUrl)
  const images = warning.imageUrls?.length ? warning.imageUrls : (warning.imageUrl ? [warning.imageUrl] : []);

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `warning-${warning.id}-${currentImageIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Détails de l&apos;avertissement</DialogTitle>
          <div className="flex items-center gap-3">
            <Badge
              variant={warning.type === 'yellow' ? 'default' : 'destructive'}
              className={warning.type === 'yellow' ? 'bg-yellow-500 text-white px-3 py-1' : 'px-3 py-1'}
            >
              {warning.type === 'yellow' ? (
                <><AlertTriangle className="h-4 w-4 mr-2" /> Carte Jaune</>
              ) : (
                <><Ban className="h-4 w-4 mr-2" /> Carte Rouge</>
              )}
            </Badge>
            {storeName && <span className="text-muted-foreground">{storeName}</span>}
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Comment Section */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <h4 className="font-semibold">Commentaire</h4>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{warning.comment}</p>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(warning.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>par {warning.createdBy}</span>
            </div>
          </div>

          {/* Images Section */}
          {images.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">
                  {images.length > 1 ? `Images jointes (${currentImageIndex + 1}/${images.length})` : 'Image jointe'}
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(images[currentImageIndex])}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Télécharger
                </Button>
              </div>
              <div className="relative rounded-lg overflow-hidden border">
                <img
                  src={images[currentImageIndex]}
                  alt={`Warning evidence ${currentImageIndex + 1}`}
                  className="w-full h-auto max-h-[400px] object-contain bg-gray-50"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex justify-center gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-primary' : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {images.length === 0 && (
            <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg">
              <p>Aucune image jointe à cet avertissement</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
