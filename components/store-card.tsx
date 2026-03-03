'use client';

import { Store } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Ban, MapPin, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface StoreCardProps {
  store: Store;
  enseigneName: string;
}

export function StoreCard({ store, enseigneName }: StoreCardProps) {
  const totalWarnings = store.yellowCount + store.redCount;
  const hasWarnings = totalWarnings > 0;

  return (
    <Link href={`/store/${store.id}`} className="block group">
      <Card className={`
        h-full transition-all duration-200 ease-out cursor-pointer
        border-2
        ${store.isBlocked ? 'border-red-200 hover:border-red-400 bg-red-50/30' : 'border-transparent hover:border-primary/20'}
        ${hasWarnings ? 'shadow-sm hover:shadow-md' : 'hover:shadow-sm'}
        hover:-translate-y-1
      `}>
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-4 min-w-0">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                ${store.isBlocked ? 'bg-red-100 text-red-600' : hasWarnings ? 'bg-yellow-100 text-yellow-600' : 'bg-primary/10 text-primary'}
              `}>
                <MapPin className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base text-gray-900 leading-tight truncate max-w-[140px] sm:max-w-[180px]">
                  {store.name}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5 truncate max-w-[140px] sm:max-w-[180px]">{enseigneName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {store.isBlocked && (
                <Badge variant="destructive" className="flex items-center gap-1 text-xs whitespace-nowrap">
                  <Ban className="h-3 w-3 flex-shrink-0" />
                  Bloqué
                </Badge>
              )}
              <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {/* Yellow */}
            <div className={`
              rounded-lg p-3 text-center
              ${store.yellowCount > 0 ? 'bg-yellow-100' : 'bg-gray-50'}
            `}>
              <div className="flex items-center justify-center gap-1 mb-1">
                <AlertTriangle className={`h-4 w-4 ${store.yellowCount > 0 ? 'text-yellow-600' : 'text-gray-400'}`} />
                <span className={`text-xl font-bold ${store.yellowCount > 0 ? 'text-yellow-700' : 'text-gray-400'}`}>
                  {store.yellowCount}
                </span>
              </div>
              <p className="text-xs text-gray-500">Jaunes</p>
            </div>

            {/* Red */}
            <div className={`
              rounded-lg p-3 text-center
              ${store.redCount > 0 ? 'bg-red-100' : 'bg-gray-50'}
            `}>
              <div className="flex items-center justify-center gap-1 mb-1">
                <Ban className={`h-4 w-4 ${store.redCount > 0 ? 'text-red-600' : 'text-gray-400'}`} />
                <span className={`text-xl font-bold ${store.redCount > 0 ? 'text-red-700' : 'text-gray-400'}`}>
                  {store.redCount}
                </span>
              </div>
              <p className="text-xs text-gray-500">Rouges</p>
            </div>
          </div>

          {/* Warning Status Bar */}
          {hasWarnings && (
            <div className="mt-4 flex gap-1 h-2 rounded-full overflow-hidden bg-gray-100">
              {store.yellowCount > 0 && (
                <div 
                  className="bg-yellow-400 h-full"
                  style={{ width: `${(store.yellowCount / totalWarnings) * 100}%` }}
                />
              )}
              {store.redCount > 0 && (
                <div 
                  className="bg-red-500 h-full"
                  style={{ width: `${(store.redCount / totalWarnings) * 100}%` }}
                />
              )}
            </div>
          )}

          {/* Empty State */}
          {!hasWarnings && (
            <div className="mt-4 text-center py-2 px-3 bg-green-50 rounded-lg border border-green-100">
              <p className="text-sm text-green-700 font-medium">
                Aucun avertissement
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
