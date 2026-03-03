export interface Enseigne {
  id: string;
  name: string;
}

export interface Store {
  id: string;
  name: string;
  enseigneId: string;
  yellowCount: number;
  redCount: number;
  isBlocked: boolean;
}

export interface Warning {
  id: string;
  storeId: string;
  type: 'yellow' | 'red';
  comment: string;
  imageUrl?: string;
  createdAt: string;
  createdBy: string;
}

export interface StoreWithWarnings extends Store {
  warnings: Warning[];
}

export interface EnseigneWithStores extends Enseigne {
  stores: Store[];
}
