'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getEnseignes, getStores, getStats } from '@/lib/data';
import { DashboardContent } from './dashboard-content';
import { AddEnseigneDialog } from '@/components/add-enseigne-dialog';
import { Card, CardContent } from '@/components/ui/card';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    enseignes: { id: string; name: string }[];
    stores: { id: string; name: string; enseigneId: string; yellowCount: number; redCount: number; isBlocked: boolean }[];
    stats: { totalStores: number; blockedStores: number; totalYellowCards: number; totalRedCards: number };
  } | null>(null);

  const loadData = useCallback(async () => {
    const [enseignes, stores, stats] = await Promise.all([
      getEnseignes(),
      getStores(),
      getStats(),
    ]);
    setData({ enseignes, stores, stats });
    setLoading(false);
  }, []);

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
  }, [router, loadData]);

  if (loading) {
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

  if (!data) {
    return null;
  }

  return (
    <DashboardContent 
      enseignes={data.enseignes} 
      stores={data.stores} 
      stats={data.stats}
      onRefresh={loadData}
    />
  );
}
