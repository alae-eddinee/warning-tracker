'use client';

import { Warning } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Ban, Download, X, Calendar, User, MessageSquare } from 'lucide-react';

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
  if (!warning) return null;

  const handleDownload = async () => {
    if (!warning.imageUrl) return;
    
    try {
      const response = await fetch(warning.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `warning-${warning.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
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

          {/* Image Section */}
          {warning.imageUrl && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Image jointe</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Télécharger
                </Button>
              </div>
              <div className="relative rounded-lg overflow-hidden border">
                <img
                  src={warning.imageUrl}
                  alt="Warning evidence"
                  className="w-full h-auto max-h-[400px] object-contain bg-gray-50"
                />
              </div>
            </div>
          )}

          {!warning.imageUrl && (
            <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg">
              <p>Aucune image jointe à cet avertissement</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
