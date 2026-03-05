'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getEnseignes, getStores } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Building2, Store, Trash2, Plus, Search } from 'lucide-react';
import Link from 'next/link';

export default function ManagePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [enseignes, setEnseignes] = useState<{ id: string; name: string }[]>([]);
  const [stores, setStores] = useState<{ id: string; name: string; enseigneId: string; yellowCount: number; redCount: number; isBlocked: boolean }[]>([]);
  
  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState<'enseigne' | 'store'>('enseigne');
  const [selectedEnseigne, setSelectedEnseigne] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      await loadData();
    };
    checkAuthAndLoad();
  }, [router]);

  const loadData = async () => {
    const [enseignesData, storesData] = await Promise.all([
      getEnseignes(),
      getStores(),
    ]);
    setEnseignes(enseignesData);
    setStores(storesData);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);

    if (type === 'enseigne') {
      const { error } = await supabase.from('enseignes').insert({ name: name.trim() });
      if (error) {
        alert('Erreur lors de la création de l\'enseigne');
      }
    } else {
      if (!selectedEnseigne) {
        alert('Veuillez sélectionner une enseigne');
        setSubmitting(false);
        return;
      }
      const { error } = await supabase.from('stores').insert({
        name: name.trim(),
        enseigne_id: selectedEnseigne,
        yellow_count: 0,
        red_count: 0,
        is_blocked: false,
      });
      if (error) {
        alert('Erreur lors de la création du magasin');
      }
    }

    setName('');
    setSelectedEnseigne('');
    await loadData();
    setSubmitting(false);
  };

  const deleteEnseigne = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette enseigne ? Tous ses magasins seront également supprimés.')) return;
    
    const { error } = await supabase.from('enseignes').delete().eq('id', id);
    if (error) {
      alert('Erreur lors de la suppression');
    } else {
      await loadData();
    }
  };

  const deleteStore = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce magasin ?')) return;
    
    const { error } = await supabase.from('stores').delete().eq('id', id);
    if (error) {
      alert('Erreur lors de la suppression');
    } else {
      await loadData();
    }
  };

  const getEnseigneName = (id: string) => {
    return enseignes.find(e => e.id === id)?.name || 'Unknown';
  };

  // Filtered lists based on search
  const filteredEnseignes = enseignes.filter(e => 
    searchQuery === '' || e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredStores = stores.filter(s => 
    searchQuery === '' || 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getEnseigneName(s.enseigneId).toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold">Chargement...</h1>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Gestion Enseignes & Magasins</h1>
              <p className="text-muted-foreground text-sm">Créer et gérer les enseignes et magasins</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Create Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Créer Nouveau
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={type} onValueChange={(v) => setType(v as 'enseigne' | 'store')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enseigne">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Enseigne
                          </div>
                        </SelectItem>
                        <SelectItem value="store">
                          <div className="flex items-center gap-2">
                            <Store className="h-4 w-4" />
                            Magasin
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {type === 'store' && (
                    <div className="space-y-2">
                      <Label>Enseigne</Label>
                      <Select value={selectedEnseigne} onValueChange={setSelectedEnseigne}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une enseigne" />
                        </SelectTrigger>
                        <SelectContent>
                          {enseignes.map((e) => (
                            <SelectItem key={e.id} value={e.id}>
                              {e.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={type === 'enseigne' ? "Ex: ACIMA" : "Ex: Magasin Casablanca"}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={submitting || !name.trim() || (type === 'store' && !selectedEnseigne)}>
                    {submitting ? 'Création...' : 'Créer'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Lists */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher enseignes ou magasins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {/* Enseignes List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Enseignes ({filteredEnseignes.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredEnseignes.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      {searchQuery ? 'Aucune enseigne trouvée' : 'Aucune enseigne'}
                    </p>
                  ) : (
                    filteredEnseignes.map((enseigne) => {
                      const storeCount = stores.filter(s => s.enseigneId === enseigne.id).length;
                      return (
                        <div
                          key={enseigne.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                        >
                          <div>
                            <p className="font-medium">{enseigne.name}</p>
                            <p className="text-sm text-muted-foreground">{storeCount} magasin(s)</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => deleteEnseigne(enseigne.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stores List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Magasins ({filteredStores.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredStores.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      {searchQuery ? 'Aucun magasin trouvé' : 'Aucun magasin'}
                    </p>
                  ) : (
                    filteredStores.map((store) => (
                      <div
                        key={store.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                      >
                        <div>
                          <p className="font-medium">{store.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {getEnseigneName(store.enseigneId)} • 
                            {store.yellowCount > 0 && ` ${store.yellowCount} jaunes`}
                            {store.redCount > 0 && ` ${store.redCount} rouges`}
                            {store.yellowCount === 0 && store.redCount === 0 && ' Aucun avertissement'}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => deleteStore(store.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
