'use client';

import { useState, useEffect } from 'react';
import { Warning, Store } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Ban, Plus, Trash2, ImageIcon, Pencil, FileDown } from 'lucide-react';
import { addWarning, removeWarning, updateWarning, getStoreWarnings, uploadWarningImage, subscribeToWarnings, subscribeToStores } from '@/lib/data';
import { WarningDetail } from './warning-detail';
import { exportWarningsToExcel } from '@/lib/export';

// Format date to show only date without time
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

interface WarningManagerProps {
  store: Store;
  enseigneName: string;
  onUpdate?: () => void;
}

export function WarningManager({ store, enseigneName, onUpdate }: WarningManagerProps) {
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadWarnings();
    
    // Subscribe to real-time warnings updates for this store
    const subscription = subscribeToWarnings((updatedWarnings) => {
      // Filter to only this store's warnings
      const storeWarnings = updatedWarnings.filter(w => w.storeId === store.id);
      setWarnings(storeWarnings);
    });
    
    // Also subscribe to store changes to update counts/block status
    const storeSubscription = subscribeToStores((updatedStores) => {
      const updatedStore = updatedStores.find(s => s.id === store.id);
      if (updatedStore) {
        // Force refresh by calling onUpdate which will re-fetch store data
        onUpdate?.();
      }
    });
    
    return () => {
      subscription.unsubscribe();
      storeSubscription.unsubscribe();
    };
  }, [store.id]);
  
  const loadWarnings = async () => {
    setIsLoading(true);
    const data = await getStoreWarnings(store.id);
    setWarnings(data);
    setIsLoading(false);
  };
  const [newComment, setNewComment] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedImagePreviews, setSelectedImagePreviews] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedWarning, setSelectedWarning] = useState<Warning | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleAddWarning = async (type: 'yellow' | 'red') => {
    if (!newComment.trim()) return;
    
    setIsUploading(true);
    const imageUrls: string[] = [];
    
    // Upload all selected images
    for (const file of selectedFiles) {
      const uploadedUrl = await uploadWarningImage(file);
      if (uploadedUrl) {
        imageUrls.push(uploadedUrl);
      }
    }
    
    await addWarning(store.id, type, newComment, imageUrls);
    setNewComment('');
    setSelectedFiles([]);
    setSelectedImagePreviews([]);
    setIsUploading(false);
    await loadWarnings();
    onUpdate?.();
    setIsDialogOpen(false);
  };

  const handleRemoveWarning = async (warningId: string) => {
    await removeWarning(warningId);
    await loadWarnings();
    onUpdate?.();
  };

  const handleEditWarning = async (warningId: string, newComment: string) => {
    await updateWarning(warningId, { comment: newComment });
    await loadWarnings();
    onUpdate?.();
  };

  const handleExport = async () => {
    setIsExporting(true);
    await exportWarningsToExcel(warnings, store, enseigneName);
    setIsExporting(false);
  };

  const handleViewWarning = (warning: Warning) => {
    setSelectedWarning(warning);
    setIsDetailOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
      
      // Create previews for new files
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setSelectedImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const filteredWarnings = warnings.filter(w => {
    if (activeTab === 'all') return true;
    return w.type === activeTab;
  });

  return (
    <div className="space-y-6">
      {/* Store Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{store.name}</CardTitle>
              <p className="text-muted-foreground">{enseigneName}</p>
            </div>
            {store.isBlocked ? (
              <Badge variant="destructive" className="text-lg px-4 py-2">
                <Ban className="h-4 w-4 mr-2" />
                Magasin Bloqué
              </Badge>
            ) : (
              <Badge variant="default" className="text-lg px-4 py-2 bg-green-500">
                Actif
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cartes Jaunes</p>
                <p className="text-3xl font-bold text-yellow-600">{store.yellowCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Ban className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cartes Rouges</p>
                <p className="text-3xl font-bold text-red-600">{store.redCount}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Warning Dialog */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Historique des Avertissements</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isExporting || warnings.length === 0}
            className="flex items-center gap-2"
          >
            <FileDown className="h-4 w-4" />
            {isExporting ? 'Export en cours...' : 'Exporter Excel'}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un Avertissement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Ajouter un Avertissement</DialogTitle>
              <DialogDescription className="sr-only">
                Formulaire pour ajouter un nouvel avertissement au magasin
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="comment">Commentaire</Label>
                <Textarea
                  id="comment"
                  placeholder="Décrire le problème de retour..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="images">Images (optionnel - plusieurs possibles)</Label>
                <div className="mt-2">
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="flex-1"
                  />
                </div>
                {selectedImagePreviews.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedImagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="h-16 w-16 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => handleAddWarning('yellow')}
                  disabled={!newComment.trim() || isUploading}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {isUploading ? 'Chargement...' : 'Carte Jaune'}
                </Button>
                <Button
                  onClick={() => handleAddWarning('red')}
                  disabled={!newComment.trim() || isUploading}
                  variant="destructive"
                  className="flex-1"
                >
                  <Ban className="h-4 w-4 mr-2" />
                  {isUploading ? 'Chargement...' : 'Carte Rouge'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Warning History */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="yellow" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Jaunes
          </TabsTrigger>
          <TabsTrigger value="red" className="flex items-center gap-2">
            <Ban className="h-4 w-4" />
            Rouges
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="space-y-3">
            {isLoading ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  Chargement...
                </CardContent>
              </Card>
            ) : filteredWarnings.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  Aucun avertissement trouvé
                </CardContent>
              </Card>
            ) : (
              filteredWarnings.map((warning) => (
                <Card 
                  key={warning.id} 
                  className="cursor-pointer hover:border-primary/50 transition-colors group"
                  onClick={() => handleViewWarning(warning)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge
                            variant={warning.type === 'yellow' ? 'default' : 'destructive'}
                            className={warning.type === 'yellow' ? 'bg-yellow-500' : ''}
                          >
                            {warning.type === 'yellow' ? (
                              <><AlertTriangle className="h-3 w-3 mr-1" /> Jaune</>
                            ) : (
                              <><Ban className="h-3 w-3 mr-1" /> Rouge</>
                            )}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{formatDate(warning.createdAt)}</span>
                          <span className="text-xs text-muted-foreground">par {warning.createdBy}</span>
                        </div>
                        <p className="text-sm line-clamp-2">{warning.comment}</p>
                        {(warning.imageUrl || (warning.imageUrls && warning.imageUrls.length > 0)) && (
                          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                            <ImageIcon className="h-4 w-4" />
                            <span>{warning.imageUrls?.length || 1} image(s) jointe(s)</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newComment = prompt('Modifier le commentaire:', warning.comment);
                            if (newComment && newComment !== warning.comment) {
                              handleEditWarning(warning.id, newComment);
                            }
                          }}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveWarning(warning.id);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Warning Detail Dialog */}
      <WarningDetail
        warning={selectedWarning}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        storeName={store.name}
      />
    </div>
  );
}
