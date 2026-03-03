'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
  const [activeTab, setActiveTab] = useState('all');

  const stats = {
    total: stores.length,
    withYellow: stores.filter(s => s.yellowCount > 0).length,
    withRed: stores.filter(s => s.redCount > 0).length,
    blocked: stores.filter(s => s.isBlocked).length,
  };

  // Filter stores based on search and active tab
  const filteredStores = useMemo(() => {
    let filtered = stores;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply tab filter
    switch (activeTab) {
      case 'yellow':
        filtered = filtered.filter(s => s.yellowCount > 0);
        break;
      case 'red':
        filtered = filtered.filter(s => s.redCount > 0);
        break;
      case 'blocked':
        filtered = filtered.filter(s => s.isBlocked);
        break;
    }
    
    return filtered;
  }, [stores, searchQuery, activeTab]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {enseigne.name}
                </h1>
                <p className="text-muted-foreground">
                  {stats.total} magasins • {stats.blocked} bloqués
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <StoreIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{stats.withYellow}</p>
                <p className="text-xs text-gray-500">Avec jaunes</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <Ban className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.withRed}</p>
                <p className="text-xs text-gray-500">Avec rouges</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-600">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-200 flex items-center justify-center">
                <Ban className="h-5 w-5 text-red-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-700">{stats.blocked}</p>
                <p className="text-xs text-gray-500">Bloqués</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher un magasin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base rounded-xl border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="space-y-4 mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 md:w-auto">
              <TabsTrigger value="all">
                Tous
                <Badge variant="secondary" className="ml-2">{stats.total}</Badge>
              </TabsTrigger>
              <TabsTrigger value="yellow">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Jaunes ({stats.withYellow})
              </TabsTrigger>
              <TabsTrigger value="red">
                <Ban className="h-4 w-4 mr-1" />
                Rouges ({stats.withRed})
              </TabsTrigger>
              <TabsTrigger value="blocked">
                <Ban className="h-4 w-4 mr-1" />
                Bloqués ({stats.blocked})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <StoreGrid stores={filteredStores} enseigneName={enseigne.name} />
            </TabsContent>
            <TabsContent value="yellow" className="mt-4">
              <StoreGrid stores={filteredStores} enseigneName={enseigne.name} />
            </TabsContent>
            <TabsContent value="red" className="mt-4">
              <StoreGrid stores={filteredStores} enseigneName={enseigne.name} />
            </TabsContent>
            <TabsContent value="blocked" className="mt-4">
              <StoreGrid stores={filteredStores} enseigneName={enseigne.name} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

interface StoreGridProps {
  stores: { id: string; name: string; enseigneId: string; yellowCount: number; redCount: number; isBlocked: boolean }[];
  enseigneName: string;
}

function StoreGrid({ stores, enseigneName }: StoreGridProps) {
  if (stores.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-lg">Aucun magasin trouvé</p>
          <p className="text-sm">Essayez une autre recherche</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {stores.map((store) => (
        <StoreCard
          key={store.id}
          store={store}
          enseigneName={enseigneName}
        />
      ))}
    </div>
  );
}
