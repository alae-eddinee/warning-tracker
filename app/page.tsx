import { getEnseignes, getStores, getStats } from '@/lib/data';
import { DashboardContent } from './dashboard-content';

export default async function DashboardPage() {
  const [enseignes, stores, stats] = await Promise.all([
    getEnseignes(),
    getStores(),
    getStats(),
  ]);

  return <DashboardContent enseignes={enseignes} stores={stores} stats={stats} />;
}
