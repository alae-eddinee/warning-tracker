'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { WarningManager } from '@/components/warning-manager';
import { getStoreById, getEnseigneById } from '@/lib/data';
import { ArrowLeft, Store } from 'lucide-react';
import Link from 'next/link';

interface StorePageProps {
  params: Promise<{ id: string }>;
}

export default function StorePage({ params }: StorePageProps) {
  const [store, setStore] = useState<Awaited<ReturnType<typeof getStoreById>>>(undefined);
  const [enseigne, setEnseigne] = useState<Awaited<ReturnType<typeof getEnseigneById>>>(undefined);
  const [storeId, setStoreId] = useState<string>('');

  useEffect(() => {
    params.then(({ id }) => {
      setStoreId(id);
      loadData(id);
    });
  }, [params]);

  const loadData = useCallback(async (id: string) => {
    const storeData = await getStoreById(id);
    setStore(storeData);
    if (storeData) {
      const enseigneData = await getEnseigneById(storeData.enseigneId);
      setEnseigne(enseigneData);
    }
  }, []);

  const handleUpdate = useCallback(() => {
    if (storeId) {
      loadData(storeId);
    }
  }, [storeId, loadData]);

  if (!store || !enseigne) {
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
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href={`/enseigne/${enseigne.id}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              {enseigne.name}
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className={`
              w-12 h-12 rounded-lg flex items-center justify-center
              ${store.isBlocked ? 'bg-red-100 text-red-600' : 
                (store.yellowCount + store.redCount) > 0 ? 'bg-yellow-100 text-yellow-600' : 'bg-primary/10 text-primary'}
            `}>
              <Store className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{store.name}</h1>
              <p className="text-muted-foreground">
                {store.isBlocked ? 'Magasin bloqué' : 
                 (store.yellowCount + store.redCount) > 0 ? `${store.yellowCount} jaune(s), ${store.redCount} rouge(s)` : 'Aucun avertissement'}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <WarningManager 
          store={store} 
          enseigneName={enseigne.name}
          onUpdate={handleUpdate}
        />
      </main>
    </div>
  );
}
