'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { StoreCard } from '@/components/store-card';
import { ArrowLeft, Building2, AlertTriangle, Ban, Store as StoreIcon, Search } from 'lucide-react';
import Link from 'next/link';

interface EnseigneContentProps {
  enseigne: { id: string; name: string };
  stores: { id: string; name: string; enseigneId: string; yellowCount: number; redCount: number; isBlocked: boolean }[];
}

export function EnseigneContent({ enseigne, stores }: EnseigneContentProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const stats = {
    total: stores.length,
    blocked: stores.filter(s => s.isBlocked).length,
    withWarnings: stores.filter(s => s.yellowCount + s.redCount > 0).length,
  };

  const filteredStores = useMemo(() => {
    if (!searchQuery) return stores;
    return stores.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [stores, searchQuery]);

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
                  {stats.total} magasins • {stats.blocked} bloqués
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4">
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
            <p>Aucun magasin trouvé</p>
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
