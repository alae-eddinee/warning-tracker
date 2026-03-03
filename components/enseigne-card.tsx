import { Enseigne } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, AlertTriangle, Ban, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface EnseigneCardProps {
  enseigne: Enseigne;
  storeCount: number;
  blockedCount: number;
  yellowCount: number;
  redCount: number;
}

export function EnseigneCard({ enseigne, storeCount, blockedCount, yellowCount, redCount }: EnseigneCardProps) {
  const totalWarnings = yellowCount + redCount;
  const hasWarnings = totalWarnings > 0;
  const isBlocked = blockedCount > 0;

  return (
    <Link href={`/enseigne/${enseigne.id}`} className="block group">
      <Card className={`
        h-full transition-all duration-200 ease-out cursor-pointer
        border-2 
        ${isBlocked ? 'border-red-200 hover:border-red-400 bg-red-50/30' : 'border-transparent hover:border-primary/20'}
        ${hasWarnings ? 'shadow-sm hover:shadow-md' : 'hover:shadow-sm'}
        hover:-translate-y-1
      `}>
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center
                ${isBlocked ? 'bg-red-100 text-red-600' : hasWarnings ? 'bg-yellow-100 text-yellow-600' : 'bg-primary/10 text-primary'}
              `}>
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 leading-tight">
                  {enseigne.name}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {storeCount} magasin{storeCount !== 1 ? 's' : ''}
                  {isBlocked && (
                    <span className="text-red-600 font-medium ml-1">
                      ({blockedCount} bloqué{blockedCount !== 1 ? 's' : ''})
                    </span>
                  )}
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2">
            {/* Yellow */}
            <div className={`
              rounded-lg p-3 text-center
              ${yellowCount > 0 ? 'bg-yellow-100' : 'bg-gray-50'}
            `}>
              <div className="flex items-center justify-center gap-1 mb-1">
                <AlertTriangle className={`h-4 w-4 ${yellowCount > 0 ? 'text-yellow-600' : 'text-gray-400'}`} />
                <span className={`text-xl font-bold ${yellowCount > 0 ? 'text-yellow-700' : 'text-gray-400'}`}>
                  {yellowCount}
                </span>
              </div>
              <p className="text-xs text-gray-500">Jaunes</p>
            </div>

            {/* Red */}
            <div className={`
              rounded-lg p-3 text-center
              ${redCount > 0 ? 'bg-red-100' : 'bg-gray-50'}
            `}>
              <div className="flex items-center justify-center gap-1 mb-1">
                <Ban className={`h-4 w-4 ${redCount > 0 ? 'text-red-600' : 'text-gray-400'}`} />
                <span className={`text-xl font-bold ${redCount > 0 ? 'text-red-700' : 'text-gray-400'}`}>
                  {redCount}
                </span>
              </div>
              <p className="text-xs text-gray-500">Rouges</p>
            </div>

            {/* Total */}
            <div className={`
              rounded-lg p-3 text-center
              ${totalWarnings > 0 ? 'bg-blue-50' : 'bg-gray-50'}
            `}>
              <div className="flex items-center justify-center mb-1">
                <span className={`text-xl font-bold ${totalWarnings > 0 ? 'text-blue-700' : 'text-gray-400'}`}>
                  {totalWarnings}
                </span>
              </div>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>

          {/* Warning Status Bar */}
          {hasWarnings && (
            <div className="mt-4 flex gap-1 h-2 rounded-full overflow-hidden bg-gray-100">
              {yellowCount > 0 && (
                <div 
                  className="bg-yellow-400 h-full"
                  style={{ width: `${(yellowCount / totalWarnings) * 100}%` }}
                />
              )}
              {redCount > 0 && (
                <div 
                  className="bg-red-500 h-full"
                  style={{ width: `${(redCount / totalWarnings) * 100}%` }}
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
