'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { EnseigneCard } from '@/components/enseigne-card';
import { Building2, Store, AlertTriangle, Ban, Search, StoreIcon } from 'lucide-react';
import Link from 'next/link';

interface DashboardContentProps {
  enseignes: { id: string; name: string }[];
  stores: { id: string; name: string; enseigneId: string; yellowCount: number; redCount: number; isBlocked: boolean }[];
  stats: { totalStores: number; blockedStores: number; totalYellowCards: number; totalRedCards: number };
}

export function DashboardContent({ enseignes, stores, stats }: DashboardContentProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate stats for each enseigne
  const enseigneStats = useMemo(() => {
    return enseignes.map(enseigne => {
      const enseigneStores = stores.filter(s => s.enseigneId === enseigne.id);
      return {
        enseigne,
        storeCount: enseigneStores.length,
        blockedCount: enseigneStores.filter(s => s.isBlocked).length,
        yellowCount: enseigneStores.reduce((sum, s) => sum + s.yellowCount, 0),
        redCount: enseigneStores.reduce((sum, s) => sum + s.redCount, 0),
      };
    }).filter(({ enseigne }) => 
      searchQuery === '' || 
      enseigne.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [enseignes, stores, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <StoreIcon className="h-5 w-5 text-primary" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Warning Tracker
                </h1>
              </div>
              <p className="text-muted-foreground">
                Système de gestion des avertissements magasins
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Enseignes</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{enseignes.length}</div>
              <p className="text-xs text-gray-500">Groupes de magasins</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Magasins</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <Store className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.totalStores}</div>
              <p className="text-xs text-gray-500">
                {stats.blockedStores > 0 ? (
                  <span className="text-red-600 font-medium">{stats.blockedStores} bloqués</span>
                ) : (
                  'Tous actifs'
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Cartes Jaunes</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.totalYellowCards}</div>
              <p className="text-xs text-gray-500">Avertissements actifs</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Cartes Rouges</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                <Ban className="h-4 w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.totalRedCards}</div>
              <p className="text-xs text-gray-500">Magasins bloqués</p>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher une enseigne..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base rounded-xl border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Enseigne Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Enseignes</h2>
              <p className="text-muted-foreground mt-1">
                {searchQuery ? `${enseigneStats.length} résultat(s)` : 'Cliquez sur une enseigne pour voir ses magasins'}
              </p>
            </div>
          </div>
          
          {enseigneStats.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucune enseigne trouvée</p>
              <p className="text-gray-400 text-sm">Essayez une autre recherche</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {enseigneStats.map(({ enseigne, storeCount, blockedCount, yellowCount, redCount }) => (
                <EnseigneCard
                  key={enseigne.id}
                  enseigne={enseigne}
                  storeCount={storeCount}
                  blockedCount={blockedCount}
                  yellowCount={yellowCount}
                  redCount={redCount}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
