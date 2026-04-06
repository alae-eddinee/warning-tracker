'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Store } from 'lucide-react';

interface AddStoreDialogProps {
  enseigneId: string;
  enseigneName: string;
  onStoreAdded: () => void;
}

export function AddStoreDialog({ enseigneId, enseigneName, onStoreAdded }: AddStoreDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    
    const { error } = await supabase
      .from('stores')
      .insert({
        name: name.trim(),
        enseigne_id: enseigneId,
        yellow_count: 0,
        red_count: 0,
        is_blocked: false,
      });

    if (error) {
      console.error('Error creating store:', error);
      alert('Erreur lors de la création du magasin');
    } else {
      setName('');
      setOpen(false);
      onStoreAdded();
    }
    
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter Magasin
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau Magasin - {enseigneName}</DialogTitle>
          <DialogDescription className="sr-only">
            Formulaire pour créer un nouveau magasin pour {enseigneName}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du magasin</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Magasin Casablanca..."
              required
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? 'Création...' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
