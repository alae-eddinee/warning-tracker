import { Enseigne } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Ban, Building2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface EnseigneCardProps {
  enseigne: Enseigne;
  storeCount: number;
  yellowCount: number;
  redCount: number;
}

export function EnseigneCard({ enseigne, storeCount, yellowCount, redCount }: EnseigneCardProps) {
  const totalWarnings = yellowCount + redCount;

  return (
    <Link href={`/enseigne/${enseigne.id}`} className="block group">
      <Card className={`
        transition-all duration-200 cursor-pointer
        border-l-4 hover:shadow-md
        ${totalWarnings > 0 ? 'border-l-yellow-500 bg-yellow-50/20' : 'border-l-green-500 bg-green-50/20'}
      `}>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className={`
                w-8 h-8 rounded flex items-center justify-center flex-shrink-0
                ${totalWarnings > 0 ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}
              `}>
                <Building2 className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm text-gray-900 truncate">
                  {enseigne.name}
                </h3>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs">
                {yellowCount > 0 && (
                  <span className="flex items-center gap-0.5 text-yellow-600 bg-yellow-100 px-1.5 py-0.5 rounded">
                    <AlertTriangle className="h-3 w-3" />
                    {yellowCount}
                  </span>
                )}
                {redCount > 0 && (
                  <span className="flex items-center gap-0.5 text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
                    <Ban className="h-3 w-3" />
                    {redCount}
                  </span>
                )}
                {totalWarnings === 0 && (
                  <span className="text-green-600 bg-green-100 px-1.5 py-0.5 rounded text-xs">
                    OK
                  </span>
                )}
              </div>
              
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-primary flex-shrink-0" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
