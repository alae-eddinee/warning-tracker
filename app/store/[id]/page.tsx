import { Card, CardContent } from '@/components/ui/card';
import { WarningManager } from '@/components/warning-manager';
import { getStoreById, getEnseigneById } from '@/lib/data';
import { ArrowLeft, Store } from 'lucide-react';
import Link from 'next/link';

interface StorePageProps {
  params: Promise<{ id: string }>;
}

export default async function StorePage({ params }: StorePageProps) {
  const { id: storeId } = await params;
  
  const store = await getStoreById(storeId);
  const enseigne = store ? await getEnseigneById(store.enseigneId) : null;

  if (!store || !enseigne) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Magasin non trouvé</h1>
            <Link href="/" className="text-primary hover:underline">
              ← Retour au tableau de bord
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href={`/enseigne/${enseigne.id}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              {enseigne.name}
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Store className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{store.name}</h1>
              <p className="text-muted-foreground">
                Détails du magasin et gestion des avertissements
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <WarningManager 
          store={store} 
          enseigneName={enseigne.name}
        />
      </main>
    </div>
  );
}
