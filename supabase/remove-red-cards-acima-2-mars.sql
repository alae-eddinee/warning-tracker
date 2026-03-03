-- Remove red cards from ACIMA 2 MARS store
-- Run this in your Supabase SQL Editor

-- Find the store ID first
-- SELECT id FROM stores WHERE name = 'ACIMA 2 MARS';

-- Delete red warnings for ACIMA 2 MARS
DELETE FROM warnings 
WHERE store_id IN (
    SELECT id FROM stores WHERE name = 'ACIMA 2 MARS'
) 
AND type = 'red';

-- This will automatically:
-- 1. Decrease red_count in stores table via trigger
-- 2. Update is_blocked to false (since no more red cards)
-- 3. Refresh real-time subscriptions
