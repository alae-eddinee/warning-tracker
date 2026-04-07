'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EnseigneCard } from '@/components/enseigne-card';
import { StoreCard } from '@/components/store-card';
import { Building2, Store, AlertTriangle, Ban, Search, LogOut, Settings, FileDown } from 'lucide-react';
import { useAuth } from './auth-provider';
import Link from 'next/link';
import { getAllWarningsWithImages } from '@/lib/data';
import { exportAllWarningsToExcel } from '@/lib/export';

interface DashboardContentProps {
  enseignes: { id: string; name: string }[];
  stores: { id: string; name: string; enseigneId: string; yellowCount: number; redCount: number; isBlocked: boolean }[];
  stats: { totalStores: number; blockedStores: number; totalYellowCards: number; totalRedCards: number };
  onRefresh: () => void;
}

export function DashboardContent({ enseignes, stores, stats, onRefresh }: DashboardContentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'yellow' | 'red'>('all');
  const [isExporting, setIsExporting] = useState(false);
  const router = useRouter();
  const { signOut } = useAuth();

  const handleExportAll = async () => {
    setIsExporting(true);
    const warnings = await getAllWarningsWithImages();
    await exportAllWarningsToExcel(warnings, stores, enseignes);
    setIsExporting(false);
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
    router.refresh();
  };

  // Calculate stats for each enseigne
  const enseigneStats = useMemo(() => {
    return enseignes.map(enseigne => {
      const enseigneStores = stores.filter(s => s.enseigneId === enseigne.id);
      return {
        enseigne,
        storeCount: enseigneStores.length,
        yellowCount: enseigneStores.reduce((sum, s) => sum + s.yellowCount, 0),
        redCount: enseigneStores.reduce((sum, s) => sum + s.redCount, 0),
      };
    }).filter(({ enseigne }) => 
      searchQuery === '' || 
      enseigne.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [enseignes, stores, searchQuery]);

  // Filter stores based on selected filter
  const filteredStores = useMemo(() => {
    return stores.filter(s => {
      if (filter === 'yellow') return s.yellowCount > 0;
      if (filter === 'red') return s.redCount > 0;
      return true;
    }).filter(s => 
      searchQuery === '' || s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [stores, filter, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Warning Tracker</h1>
              <p className="text-muted-foreground text-sm">
                Gestion des avertissements magasins
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportAll}
                disabled={isExporting}
                className="flex items-center gap-2"
              >
                <FileDown className="h-4 w-4" />
                {isExporting ? 'Export en cours...' : 'Exporter Excel'}
              </Button>
              <Link href="/manage">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Gérer
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4">
        {/* Stats Overview with Filters */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-3 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xl font-bold">{enseignes.length}</p>
                  <p className="text-xs text-gray-500">Enseignes</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-3 flex items-center gap-2">
                <Store className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-xl font-bold">{stats.totalStores}</p>
                  <p className="text-xs text-gray-500">Magasins</p>
                </div>
              </CardContent>
            </Card>

            <button 
              onClick={() => setFilter(filter === 'yellow' ? 'all' : 'yellow')}
              className="text-left"
            >
              <Card className={`border-l-4 border-l-yellow-500 cursor-pointer transition-colors ${filter === 'yellow' ? 'bg-yellow-50 ring-2 ring-yellow-400' : 'hover:bg-yellow-50/50'}`}>
                <CardContent className="p-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <div>
                    <p className="text-xl font-bold">{stats.totalYellowCards}</p>
                    <p className="text-xs text-gray-500">Cartons Jaunes</p>
                  </div>
                </CardContent>
              </Card>
            </button>

            <button 
              onClick={() => setFilter(filter === 'red' ? 'all' : 'red')}
              className="text-left"
            >
              <Card className={`border-l-4 border-l-red-500 cursor-pointer transition-colors ${filter === 'red' ? 'bg-red-50 ring-2 ring-red-400' : 'hover:bg-red-50/50'}`}>
                <CardContent className="p-3 flex items-center gap-2">
                  <Ban className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-xl font-bold">{stats.totalRedCards}</p>
                    <p className="text-xs text-gray-500">Cartons Rouges</p>
                  </div>
                </CardContent>
              </Card>
            </button>
          </div>

          {/* Filter indicator */}
          {filter !== 'all' && (
            <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
              <p className="text-sm font-medium">
                Filtré: Magasins avec {filter === 'yellow' ? 'cartons jaunes' : 'cartons rouges'} ({filteredStores.length})
              </p>
              <Button variant="ghost" size="sm" onClick={() => setFilter('all')}>
                Réinitialiser
              </Button>
            </div>
          )}
        </div>

        {/* Content based on filter */}
        {filter === 'all' ? (
          <>
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher une enseigne..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Enseignes Grid */}
            {enseigneStats.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {enseigneStats.map(({ enseigne, storeCount, yellowCount, redCount }) => (
                  <EnseigneCard
                    key={enseigne.id}
                    enseigne={enseigne}
                    storeCount={storeCount}
                    yellowCount={yellowCount}
                    redCount={redCount}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                {searchQuery ? 'Aucune enseigne trouvée' : 'Aucune enseigne'}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Search for stores */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder={`Rechercher un magasin avec ${filter === 'yellow' ? 'cartons jaunes' : 'cartons rouges'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtered Stores Grid */}
            {filteredStores.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStores.map((store) => (
                  <StoreCard
                    key={store.id}
                    store={store}
                    enseigneName={enseignes.find(e => e.id === store.enseigneId)?.name || 'Unknown'}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                {searchQuery ? 'Aucun magasin trouvé' : `Aucun magasin avec ${filter === 'yellow' ? 'cartons jaunes' : 'cartons rouges'}`}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
