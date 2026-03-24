'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StoreCard } from '@/components/store-card';
import { ArrowLeft, Building2, Search, Store, AlertTriangle, Ban } from 'lucide-react';
import Link from 'next/link';
import { getEnseigneById, getStoresByEnseigne } from '@/lib/data';

interface EnseignePageProps {
  params: Promise<{ id: string }>;
}

export default function EnseignePage({ params }: EnseignePageProps) {
  const [enseigne, setEnseigne] = useState<{ id: string; name: string } | null>(null);
  const [stores, setStores] = useState<{ id: string; name: string; enseigneId: string; yellowCount: number; redCount: number; isBlocked: boolean }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'yellow' | 'red'>('all');
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const { id } = await params;
    const [enseigneData, storesData] = await Promise.all([
      getEnseigneById(id),
      getStoresByEnseigne(id),
    ]);
    setEnseigne(enseigneData || null);
    setStores(storesData);
    setLoading(false);
  }, [params]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const stats = {
    total: stores.length,
    withWarnings: stores.filter(s => s.yellowCount + s.redCount > 0).length,
    totalYellow: stores.reduce((sum, s) => sum + s.yellowCount, 0),
    totalRed: stores.reduce((sum, s) => sum + s.redCount, 0),
  };

  const filteredStores = useMemo(() => {
    return stores.filter(s => {
      if (filter === 'yellow') return s.yellowCount > 0;
      if (filter === 'red') return s.redCount > 0;
      return true;
    }).filter(s => 
      searchQuery === '' || s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [stores, filter, searchQuery]);

  if (loading || !enseigne) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Chargement...</h1>
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
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{enseigne.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {stats.total} magasins
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4">
        {/* Stats Cards with Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {/* Total Stores */}
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-3 flex items-center gap-2">
              <Store className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xl font-bold">{stats.total}</p>
                <p className="text-xs text-gray-500">Magasins</p>
              </div>
            </CardContent>
          </Card>

          {/* With Warnings */}
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-xl font-bold">{stats.withWarnings}</p>
                <p className="text-xs text-gray-500">Avec Avert.</p>
              </div>
            </CardContent>
          </Card>

          {/* Cartons Jaunes - Clickable Filter */}
          <button 
            onClick={() => setFilter(filter === 'yellow' ? 'all' : 'yellow')}
            className="text-left"
          >
            <Card className={`border-l-4 border-l-yellow-500 cursor-pointer transition-colors ${filter === 'yellow' ? 'bg-yellow-50 ring-2 ring-yellow-400' : 'hover:bg-yellow-50/50'}`}>
              <CardContent className="p-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="text-xl font-bold">{stats.totalYellow}</p>
                  <p className="text-xs text-gray-500">Cartons Jaunes</p>
                </div>
              </CardContent>
            </Card>
          </button>

          {/* Cartons Rouges - Clickable Filter */}
          <button 
            onClick={() => setFilter(filter === 'red' ? 'all' : 'red')}
            className="text-left"
          >
            <Card className={`border-l-4 border-l-red-500 cursor-pointer transition-colors ${filter === 'red' ? 'bg-red-50 ring-2 ring-red-400' : 'hover:bg-red-50/50'}`}>
              <CardContent className="p-3 flex items-center gap-2">
                <Ban className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-xl font-bold">{stats.totalRed}</p>
                  <p className="text-xs text-gray-500">Cartons Rouges</p>
                </div>
              </CardContent>
            </Card>
          </button>
        </div>

        {/* Filter indicator */}
        {filter !== 'all' && (
          <div className="flex items-center justify-between bg-muted p-3 rounded-lg mb-4">
            <p className="text-sm font-medium">
              Filtré: Magasins avec {filter === 'yellow' ? 'cartons jaunes' : 'cartons rouges'} ({filteredStores.length})
            </p>
            <Button variant="ghost" size="sm" onClick={() => setFilter('all')}>
              Réinitialiser
            </Button>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher un magasin..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        {/* Stores List */}
        {filteredStores.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>{searchQuery ? 'Aucun magasin trouvé' : filter !== 'all' ? `Aucun magasin avec ${filter === 'yellow' ? 'cartons jaunes' : 'cartons rouges'}` : 'Aucun magasin'}</p>
          </div>
        ) : (
          <div className="grid gap-2">
            {filteredStores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                compact
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
