// Re-export all data functions from Supabase layer
// This file acts as the data API for the application

export {
  // Enseignes
  getEnseignes,
  getEnseigneById,

  // Stores
  getStores,
  getStoresByEnseigne,
  getStoreById,
  searchStores,

  // Warnings
  getWarnings,
  getStoreWarnings,
  addWarning,
  updateWarning,
  removeWarning,

  // Storage
  uploadWarningImage,

  // Stats
  getStats,
  getCardStats,
  getTopStoresWithWarnings,

  // Subscriptions
  subscribeToStores,
  subscribeToWarnings,
} from './data-supabase';
