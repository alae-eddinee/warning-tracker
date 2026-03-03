import { Card, CardContent } from '@/components/ui/card';
import { StoreCard } from '@/components/store-card';
import { getEnseigneById, getStoresByEnseigne } from '@/lib/data';
import { Search } from 'lucide-react';
import { EnseigneContent } from './enseigne-content';

interface EnseignePageProps {
  params: Promise<{ id: string }>;
}

export default async function EnseignePage({ params }: EnseignePageProps) {
  const { id: enseigneId } = await params;
  
  const [enseigne, stores] = await Promise.all([
    getEnseigneById(enseigneId),
    getStoresByEnseigne(enseigneId),
  ]);

  if (!enseigne) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Enseigne non trouvée</h1>
            <a href="/" className="text-primary hover:underline">
              ← Retour au tableau de bord
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <EnseigneContent enseigne={enseigne} stores={stores} />;
}

interface StoreGridProps {
  stores: { id: string; name: string; enseigneId: string; yellowCount: number; redCount: number; isBlocked: boolean }[];
  enseigneName: string;
}

export function StoreGrid({ stores, enseigneName }: StoreGridProps) {
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
